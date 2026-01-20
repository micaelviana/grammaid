import axios from "axios"

interface N8nError {
  type: string
  description: string
  suggestion: string
  wrongText: string // A palavra/frase errada que será localizada no texto
  //NOTE: inicialmente o LLM retornaria as posicões dos erros, mas ele alucinava a resposta
  startingPos?: number // Opcional - será calculado pelo backend
  endingPos?: number // Opcional - será calculado pelo backend
}

interface N8nCriteria {
  type: "CONTENT" | "ORGANIZATION" | "GRAMMAR"
  score: number
  errors: N8nError[]
}

interface N8nResponse {
  suggestedText: string
  modelVersion: string
  criteria: N8nCriteria[]
}

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

if (!N8N_WEBHOOK_URL) {
  console.warn(
    "N8N_WEBHOOK_URL not configured. Essay correction will not work.",
  )
}

/**
 * Calcula as posições dos erros no texto original usando indexOf
 * Retorna uma nova resposta com as posições calculadas
 */
function calculateErrorPositions(
  response: N8nResponse,
  essayText: string,
): N8nResponse {
  let searchOffset = 0 // Offset para evitar encontrar o mesmo erro múltiplas vezes

  const criteriaWithPositions = response.criteria.map((criteria) => {
    const errorsWithPositions = criteria.errors.map((error) => {
      // Procurar o texto errado a partir do offset atual
      const startingPos = essayText.indexOf(error.wrongText, searchOffset)

      if (startingPos === -1) {
        console.warn(
          `Could not find wrongText "${error.wrongText}" in essay. Skipping this error.`,
        )
        return null // Marcar para remoção
      }

      const endingPos = startingPos + error.wrongText.length

      // Atualizar offset para a próxima busca (evitar duplicatas)
      searchOffset = endingPos

      //Tem que espalhar o erro para construir o objeto com todos os campos pre-definidos mais as posicoes que eu acabei de achar
      return {
        ...error,
        startingPos,
        endingPos,
      }
    })

    // Filtrar erros que não foram encontrados (null)
    const validErrors = errorsWithPositions.filter(
      (error) => error !== null,
    ) as (N8nError & { startingPos: number; endingPos: number })[]

    return {
      ...criteria,
      errors: validErrors,
    }
  })

  return {
    ...response,
    criteria: criteriaWithPositions,
  }
}

export const callN8nCorrection = async (
  essayText: string,
  proposalTitle: string,
  proposalText: string,
): Promise<N8nResponse> => {
  if (!N8N_WEBHOOK_URL) {
    throw new Error("N8N_WEBHOOK_URL is not configured")
  }

  try {
    const response = await axios.post<N8nResponse>(
      N8N_WEBHOOK_URL,
      {
        text: essayText,
        proposalTitle,
        proposalText,
      },
      {
        timeout: 180000, // 180 seconds (3 minutes)
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    validateN8nResponse(response.data)

    const responseWithPositions = calculateErrorPositions(
      response.data,
      essayText,
    )

    return responseWithPositions
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      throw new Error("n8n request timeout after 180 seconds")
    }

    if (error.response) {
      throw new Error(
        `n8n returned error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      )
    }

    if (error.request) {
      throw new Error("n8n webhook is unreachable")
    }

    throw error
  }
}

function validateN8nResponse(data: any): asserts data is N8nResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid n8n response: not an object")
  }

  if (typeof data.suggestedText !== "string") {
    throw new Error("Invalid n8n response: missing or invalid 'suggestedText'")
  }

  if (typeof data.modelVersion !== "string") {
    throw new Error("Invalid n8n response: missing or invalid 'modelVersion'")
  }

  if (!Array.isArray(data.criteria) || data.criteria.length !== 3) {
    throw new Error(
      "Invalid n8n response: 'criteria' must be an array with exactly 3 items",
    )
  }

  const validTypes = ["CONTENT", "ORGANIZATION", "GRAMMAR"]
  const foundTypes = new Set<string>()

  for (const criteria of data.criteria) {
    if (!validTypes.includes(criteria.type)) {
      throw new Error(
        `Invalid n8n response: invalid criteria type '${criteria.type}'`,
      )
    }

    if (foundTypes.has(criteria.type)) {
      throw new Error(
        `Invalid n8n response: duplicate criteria type '${criteria.type}'`,
      )
    }

    foundTypes.add(criteria.type)

    if (typeof criteria.score !== "number") {
      throw new Error(
        `Invalid n8n response: criteria '${criteria.type}' has invalid score`,
      )
    }

    if (criteria.score < 0 || criteria.score > 100) {
      throw new Error(
        `Invalid n8n response: criteria '${criteria.type}' score must be between 0-100`,
      )
    }

    if (!Array.isArray(criteria.errors)) {
      throw new Error(
        `Invalid n8n response: criteria '${criteria.type}' errors must be an array`,
      )
    }

    for (const error of criteria.errors) {
      if (typeof error.type !== "string") {
        throw new Error("Invalid n8n response: error missing 'type'")
      }

      if (typeof error.description !== "string") {
        throw new Error("Invalid n8n response: error missing 'description'")
      }

      if (typeof error.suggestion !== "string") {
        throw new Error("Invalid n8n response: error missing 'suggestion'")
      }

      if (typeof error.wrongText !== "string" || error.wrongText.length === 0) {
        throw new Error("Invalid n8n response: error missing 'wrongText'")
      }
    }
  }

  // Checar se os 3 critérios estão presentes
  if (foundTypes.size !== 3) {
    throw new Error(
      "Invalid n8n response: must include all 3 criteria types (CONTENT, ORGANIZATION, GRAMMAR)",
    )
  }
}
