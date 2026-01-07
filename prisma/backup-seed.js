import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log(
      Object.keys(prisma)
        .filter(key =>
          // typeof prisma[key].findMany === 'function' &&
          // !key.startsWith('_')
          !key.startsWith('_') && !key.startsWith('$')
        )
        
    )
    // Get all model names from Prisma schema
    const modelNames = Object.keys(prisma).filter(key => 
      !key.startsWith('_') && !key.startsWith('$')
    )

    const backupData = {}

    // Query all data for each model
    for (const modelName of modelNames) {
      try {
        backupData[modelName] = await prisma[modelName].findMany()
        console.log(`Backed up ${backupData[modelName].length} records from ${modelName}`)
      } catch (error) {
        console.error(`Error backing up ${modelName}:`, error)
      }
    }

    // Write backup to a JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = `backup-${timestamp}.json`
    await fs.writeFile(backupFileName, JSON.stringify(backupData, null, 2))
    console.log(`Backup saved to ${backupFileName}`)

    // Generate seed file
    const seedFileContent = `
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const backupData = ${JSON.stringify(backupData, null, 2)}

  for (const [modelName, data] of Object.entries(backupData)) {
    if (Array.isArray(data) && data.length > 0) {
      for (const item of data) {
        // Remove id field to allow auto-generation of new ids
        const { id, ...itemWithoutId } = item
        try {
          await prisma[modelName].create({
            data: itemWithoutId
          })
        } catch (error) {
          console.error(\`Error seeding \${modelName}:\`, error)
        }
      }
      console.log(\`Seeded \${data.length} records into \${modelName}\`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`

    await fs.writeFile('prisma/seed.js', seedFileContent)
    console.log('Seed file generated at prisma/seed.js')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()