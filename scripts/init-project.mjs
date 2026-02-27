import { readFile, writeFile, access } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { randomBytes } from 'node:crypto'

const projectConfigPath = new URL('../src/project/project.config.ts', import.meta.url)
const envExamplePath = new URL('../.env.example', import.meta.url)
const envPath = new URL('../.env', import.meta.url)

function randomSecret() {
  return randomBytes(48).toString('hex')
}

async function fileExists(url) {
  try {
    await access(url)
    return true
  } catch {
    return false
  }
}

function replaceEnvLine(envContents, key, value) {
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  if (pattern.test(envContents)) {
    return envContents.replace(pattern, `${key}=${value}`)
  }
  return `${envContents.trimEnd()}\n${key}=${value}\n`
}

function setProjectConfigValue(contents, key, valueLiteral) {
  const pattern = new RegExp(`(^\\s*${key}:\\s*)([^,\\n]+)(,?)$`, 'm')
  if (!pattern.test(contents)) return contents
  return contents.replace(pattern, `$1${valueLiteral}$3`)
}

async function main() {
  const rl = createInterface({ input, output })

  const existingProjectConfig = await readFile(projectConfigPath, 'utf8')

  const projectName = (await rl.question('Project name (e.g. "My Site"): ')).trim() || 'Payload Project'
  const publicServerURL =
    (await rl.question('Public server URL (e.g. http://localhost:3000): ')).trim() || 'http://localhost:3000'
  const enableCommerceAnswer = (await rl.question('Enable commerce module? (y/N): ')).trim().toLowerCase()
  const enableCommerce = enableCommerceAnswer === 'y' || enableCommerceAnswer === 'yes'

  rl.close()

  // 1) Update src/project/project.config.ts
  let nextProjectConfig = existingProjectConfig
  nextProjectConfig = setProjectConfigValue(nextProjectConfig, 'projectName', JSON.stringify(projectName))
  nextProjectConfig = setProjectConfigValue(nextProjectConfig, 'enableCommerce', enableCommerce ? 'true' : 'false')
  nextProjectConfig = setProjectConfigValue(nextProjectConfig, 'enableOrders', enableCommerce ? 'true' : 'false')
  nextProjectConfig = setProjectConfigValue(nextProjectConfig, 'titleSuffix', JSON.stringify(projectName))

  if (nextProjectConfig !== existingProjectConfig) {
    await writeFile(projectConfigPath, nextProjectConfig, 'utf8')
  }

  // 2) Create .env from .env.example if missing, and set key values
  const hasEnv = await fileExists(envPath)
  const envBase = hasEnv ? await readFile(envPath, 'utf8') : await readFile(envExamplePath, 'utf8')

  let nextEnv = envBase
  nextEnv = replaceEnvLine(nextEnv, 'PAYLOAD_PUBLIC_SERVER_URL', publicServerURL)

  // If PAYLOAD_SECRET is still a placeholder, replace it.
  const secretPlaceholder = /^PAYLOAD_SECRET=(change-me)?$/m
  if (secretPlaceholder.test(nextEnv) || !/^PAYLOAD_SECRET=/m.test(nextEnv)) {
    nextEnv = replaceEnvLine(nextEnv, 'PAYLOAD_SECRET', randomSecret())
  }

  if (!hasEnv) {
    await writeFile(envPath, nextEnv, 'utf8')
    // eslint-disable-next-line no-console
    console.log('Created .env from .env.example.')
  } else {
    await writeFile(envPath, nextEnv, 'utf8')
    // eslint-disable-next-line no-console
    console.log('Updated .env.')
  }

  // eslint-disable-next-line no-console
  console.log('\nNext steps:')
  // eslint-disable-next-line no-console
  console.log('- docker compose up -d --build')
  // eslint-disable-next-line no-console
  console.log(`- Open: ${publicServerURL}/admin`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

