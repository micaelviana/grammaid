import express from "express"
import getEnv from "./utils/getEnv"
import router from "./router/router"
import cookieParser from "cookie-parser"
import session from "express-session"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import { PrismaClient } from "./generated/prisma"
import { createLanguageCookie } from "./middlewares/createLanguageCookie"
import cors from "cors"

declare module "express-session" {
  interface SessionData {
    userType: number
    userId: string
  }
}

const env = getEnv()
const app = express()
const prisma = new PrismaClient({
  log: ["error", "warn"],
})

// Configurar CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
)

//receber o json
app.use(express.json())
app.use(cookieParser())
app.use(createLanguageCookie())

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: true,
    rolling: true,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 30 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  }),
)

app.use(router)

app.get("/", (req, res) => {
  res.send("Olá, bem-vindo(a) ao curso de PW2!")
})

// Conectar ao banco antes de iniciar o servidor
prisma
  .$connect()
  .then(() => {
    console.log("Connected to database successfully!")
    app.listen(env.PORT, () => {
      console.log(`App running on port ${env.PORT}.`)
    })
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error)
    process.exit(1)
  })
