import Browser from 'zombie'
import axios from 'axios'
Browser.waitDuration = '60s'

const FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token'

export default async function getTokenAndId (email, password) {
  email = email || process.env.FACEBOOK_EMAIL
  password = password || process.env.FACEBOOK_PASSWORD

  if (!email || !password) {
    throw new Error('Define username and password via env vars')
  }

  let token

  const browser = new Browser()

  browser.on('loaded', () => {
    var t = browser.url.match(/#access_token=(.+)&/)

    if (t && t[1]) {
      token = t[1]
    }
  })

  await browser.visit(FACEBOOK_AUTHENTICATION_TOKEN_URL)
  browser.fill('#email', email).fill('#pass', password)
  await browser.pressButton('#loginbutton')

  let {data: {id: profile_id}} = await axios.get(`https://graph.facebook.com/me?access_token=${token}`)

  return { token, profile_id }
}
