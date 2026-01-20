import { cleanEnv, port, str, num } from "envalid"
import dotenv from "dotenv"

dotenv.config({ quiet: true })

function getEnv() {
  return cleanEnv(process.env, {
    PORT: port({ default: 6677 }),
    DEFAULT_LANGUAGE: str({ default: "pt-BR" }),
    SESSION_SECRET: str(),
    BCRYPT_ROUNDS: num({ default: 10 }),
    FRONTEND_URL: str(),
  })
}
export default getEnv
