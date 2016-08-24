#!/usr/bin/env node
import tinderauth from '../dist'
import Promise from 'bluebird'
import inquirer from 'inquirer'
import tinder from 'tinder'
const tinderApi = Promise.promisifyAll(new tinder.TinderClient())

var questions = [
  {
    type: 'input',
    name: 'email',
    message: 'Email'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Password'
  }
]

;(async function() {
  let {email, password} = await inquirer.prompt(questions)

  console.log('Getting your tinder fb access token this can take a while... (1-3 min)')
  let {token, profile_id} = await tinderauth(email, password)
  await tinderApi.authorizeAsync(token, profile_id)
  console.log(`Facebook token ready for profile ${profile_id}: ${token}`)

  console.log('Getting tinder token...')
  let tinderToken = tinderApi.getAuthToken()
  console.log(`Your tinder token: ${tinderToken}`)
  console.log('Have fun :)')
  process.exit(0)
})().catch((e) => {
  console.error('Tinderauth failed:', e.message)
  process.exit(1)
})

