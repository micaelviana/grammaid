import { PrismaClient, Level } from "../src/generated/prisma"
import { UserTypes } from "../src/resources/userType/userType.constants"
import { genSalt, hash } from "bcryptjs"

const prisma = new PrismaClient()

async function seed() {
  // Criar tipos de usuário
  await prisma.userType.createMany({
    data: [
      { id: UserTypes.admin, label: "ADMIN" },
      { id: UserTypes.student, label: "STUDENT" },
    ],
    skipDuplicates: true,
  })

  // Criar usuários de exemplo
  const salt = await genSalt(10)

  // Usuário Admin
  const adminPassword = await hash("admin123", salt)
  await prisma.user.upsert({
    where: { email: "admin@grammaid.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@grammaid.com",
      password: adminPassword,
      level: Level.ADVANCED,
      typeId: UserTypes.admin,
    },
  })

  // Usuário Student
  const userPassword = await hash("user123", salt)
  await prisma.user.upsert({
    where: { email: "user@grammaid.com" },
    update: {},
    create: {
      name: "User",
      email: "user@grammaid.com",
      password: userPassword,
      level: Level.BASIC,
      typeId: UserTypes.student,
    },
  })

  console.log("✓ UserTypes criados")
  console.log("✓ Admin criado: admin@grammaid.com / admin123")
  console.log("✓ User criado: user@grammaid.com / user123")
}

seed()
  .then(() => {
    console.log("\n✅ Seed executado com sucesso!")
  })
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
