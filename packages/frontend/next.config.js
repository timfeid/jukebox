const dotenv = require('dotenv')

dotenv.config()

const env = {}

const validEnvs = ['GQL_ENDPOINT']

for (const key of Object.keys(process.env)) {
  if (validEnvs.includes(key)) {
    env[key] = process.env[key]
  }
}

module.exports = {
  env,
  typescript: {
    ignoreBuildErrors: true,
  }
}