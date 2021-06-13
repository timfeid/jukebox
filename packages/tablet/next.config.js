const dotenv = require('dotenv')

dotenv.config()

const env = {}

const validEnvs = ['GQL_ENDPOINT', 'HOME_TOKEN']

for (const key of Object.keys(process.env)) {
  if (validEnvs.includes(key)) {
    env[key] = process.env[key]
  }
}

module.exports = {
  env,
}