import Browser from 'zombie'
import _ from 'underscore'
import axios from 'axios'
Browser.waitDuration = '60s'
const debug = require('debug')('tinderauth')

import nock from 'nock'

const FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=fb464891386855067://authorize/&&scope=user_birthday,user_photos,user_education_history,email,user_relationship_details,user_friends,user_work_history,user_likes&response_type=token'

export default async function getTokenAndId (email, password) {
  email = email || process.env.FACEBOOK_EMAIL
  password = password || process.env.FACEBOOK_PASSWORD

  if (!email || !password) {
    throw new Error('Define username and password via env vars')
  }

  const browser = new Browser()

  await browser.visit(FACEBOOK_AUTHENTICATION_TOKEN_URL)
  browser.fill('#email', email).fill('#pass', password)
  await browser.pressButton('#loginbutton')

  debug('passed login')
  nock.recorder.rec({output_objects: true, dont_print: true})
  await browser.pressButton("button[name='__CONFIRM__']")

  var nockCallObjects = nock.recorder.play()
  let tokenResponse = _.filter(nockCallObjects, (nockCallObject) =>
    nockCallObject.path === '/v2.1/dialog/oauth/confirm?dpr=1' ||
    nockCallObject.path === '/v2.1/dialog/oauth/read?dpr=1'
  )

  if (tokenResponse.length !== 1) {
    throw new Error(`Tinderauth tokenresponse not found! length: ${tokenResponse.length}`)
  }
  debug(tokenResponse[0].response)

  let [, token] = tokenResponse[0].response.match(/#access_token=(.+)&/)
  let {data: {id: profile_id}} = await axios.get(`https://graph.facebook.com/me?access_token=${token}`)

  let ret = {token, profile_id}
  debug(ret)
  return ret
}
