import {streamCommitsQuery, streamSearchQuery, userInfoQuery} from "@/speckleQueries";

export const APP_NAME = process.env.VUE_APP_SPECKLE_NAME
export const SERVER_URL = process.env.VUE_APP_SERVER_URL
export const TOKEN = `${APP_NAME}.AuthToken`
export const REFRESH_TOKEN = `${APP_NAME}.RefreshToken`
export const CHALLENGE = `${APP_NAME}.Challenge`

export function goToSpeckleAuthPage() {
  // Generate random challenge
  var challenge = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  // Save challenge in localStorage
  localStorage.setItem(CHALLENGE, challenge)
  // Send user to auth page
  window.location = `${SERVER_URL}/authn/verify/${process.env.VUE_APP_SPECKLE_ID}/${challenge}`
}

export function speckleLogOut() {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
}

export async function exchangeAccessCode(accessCode) {
  var res = await fetch(`${SERVER_URL}/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessCode: accessCode,
      appId: process.env.VUE_APP_SPECKLE_ID,
      appSecret: process.env.VUE_APP_SPECKLE_SECRET,
      challenge: localStorage.getItem(CHALLENGE)
    })
  })
  var data = await res.json()
  if (data.token) {
    localStorage.removeItem(CHALLENGE)
    localStorage.setItem(TOKEN, data.token)
    localStorage.setItem(REFRESH_TOKEN, data.refreshToken)
  }
  return data
}

export async function speckleFetch(query) {
  let token = localStorage.getItem(TOKEN)
  if (token)
    try {
      var res = await fetch(
        `${SERVER_URL}/graphql`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: query
          })
        })
      return await res.json()
    } catch (err) {
      console.error("API call failed", err)
    }
  else
    return Promise.reject("You are not logged in (token does not exist)")
}

export const getUserData = () => speckleFetch(userInfoQuery())

export const searchStreams = (e) => speckleFetch(streamSearchQuery(e))

export const getStreamCommits = (streamId, itemsPerPage, cursor) => speckleFetch(streamCommitsQuery(streamId, itemsPerPage, cursor))