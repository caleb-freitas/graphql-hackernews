import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const addLink = await prisma.link.create({
    data: {
      description: "this is the link description",
      url: "this is the url"
    }
  })
  const links = await prisma.link.findMany()
  console.log(links)
}

main()
  .catch((err) => {
    throw err
  })
  .finally(async () => {
    await prisma.$disconnect()
  })