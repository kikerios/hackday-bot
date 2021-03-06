'use strict'

const config = require('../../config')

const Logger = require('bucker').createLogger({
  name: 'facebook',
  console: config.get('/logger/options/console')
})

const wreck = require('./wreck-promise'),
  fbApiUrl = config.get('/messenger/apiUrl'),
  fbMessagePath = config.get('/messenger/messagePath'),
  fbAccessToken = config.get('/messenger/accessToken')

// send message to facebook
const response = (template) => {

  return new Promise((resolve, reject) => {
    const payload = template || {}
    const uri = (fbMessagePath || '/').concat(`?access_token=${fbAccessToken}`)
    const timeout = 5000

    const opts = {
      baseUrl: fbApiUrl,
      payload: payload,
      timeout: timeout,
      rejectUnauthorized: true
    }

    wreck.post(uri, opts).then(response => {
      let recipientId = response.body.recipient_id
      let messageId = response.body.message_id
      Logger.info('Successfully sent message with id %s to recipient %s', messageId, recipientId)
      resolve()
    }).catch((error) => {
      Logger.error(error, 'Unable to send message %j', payload)
      reject()
    })
  })

}

const getUser = (userId) => {

  return new Promise((resolve, reject) => {

    const uri = (`/${userId}` || '/').concat(`?access_token=${fbAccessToken}`)
    const timeout = 5000

    const opts = {
      baseUrl: fbApiUrl,
      timeout: timeout,
      rejectUnauthorized: true
    }

    wreck.get(uri, opts).then(response => {
      Logger.info('User Data %j', response)
      resolve(response.body)
    }).catch((error) => {
      Logger.error('User Data', error)
      reject(error)
    })
  })

}

module.exports = {
  response,
  getUser
}
