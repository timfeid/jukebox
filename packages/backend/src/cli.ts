// import 'reflect-metadata'
// import dotenv from 'dotenv'
// import {app} from './app'

// dotenv.config()

// app.listen(3000)

import inquirer from 'inquirer'
import {API} from '@gym/ytm-api'
import { Player } from './play'

const getList = async (input: string) => {
  const results = await API.search(input)

  return {
    type: 'rawlist',
    message: 'OK, here is what I found',
    name: 'choice',
    choices: results.filter(result => !!result.youtubeId).map(result => {
      return {
        key: result.youtubeId,
        name: `${result.artist} - ${result.title} (${result.album})`,
        value: result.youtubeId,
      }
    })
  }
}

const main = async function () {
  const result = await inquirer.prompt({
      type: 'input',
      name: 'search',
      message: 'What would you like to play?'
  })

  const list = await getList(result.search)
  const response = await inquirer.prompt(list)

  Player.play(`https://youtube.com/watch/?v=${response.choice}`)
}

main()
