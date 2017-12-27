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
  try {
    await browser.pressButton('#loginbutton')
  } catch (e) {
    debug('#loginbutton not found trying input[name=login]')
    await browser.pressButton("input[name='login']")
  }

  debug('passed login')
  nock.recorder.rec({output_objects: true, dont_print: true})
  try {
    await browser.pressButton("button[name='__CONFIRM__']")
  } catch (e) {
    // TODO better non critical error handling
    if (e.message === "Cannot read property 'birthdate' of null") {
      debug(`got error ${e.message} but ignoring`)
      try {
        await browser.wait()
      } catch (e) {
        nock.recorder.restore()
        nock.recorder.clear()
        throw e
      }
    } else {
      nock.recorder.restore()
      nock.recorder.clear()
      throw e
    }
  }

  var nockCallObjects = nock.recorder.play()
  let urlRegex = /\/v[0-9]\.[0-9]\/dialog\/oauth\/(confirm|read)\?dpr=[0-9]{1}/
  let tokenResponse = _.filter(nockCallObjects, (nockCallObject) => urlRegex.test(nockCallObject.path))

  nock.recorder.restore()
  nock.recorder.clear()

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
