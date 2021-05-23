// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from 'firebase-admin'
import getUserProfile from './users/getUserProfile'
import getClaims from './users/getClaims'
import modifyClaim from './users/modifyClaim'
import newUserRegistration from './users/newUserRegistration'
import setProfileAttribute from './users/setProfileAttribute'
import userDeleted from './users/userDeleted'
import setMessage from './messenger/setMessage'
import getNotifications from './messenger/getNotifications'
import leaveGroup from './messenger/leaveGroup'
import joinGroup from './messenger/joinGroup'
import markAsSeen from './messenger/markAsSeen'
import createCall from './webrtc/createCall'
import setCallOffer from './webrtc/setCallOffer'

const secrets = require('../secrets.json')

admin.initializeApp({
    credential: admin.credential.cert(secrets.SERVICE_ACCOUNT_TOKEN)
})

export {
    getUserProfile,
    getClaims, 
    modifyClaim, 
    newUserRegistration, 
    setProfileAttribute,
    userDeleted,
    setMessage,
    getNotifications,
    leaveGroup,
    joinGroup,
    markAsSeen,
    createCall,
    setCallOffer
}

// // OnCall functions for messages
// exports.setMessage = require('./src/messenger/setMessage').setMessage
// exports.getNotifications = require('./src/messenger/getNotifications').getNotifications
// exports.markAsSeen = require('./src/messenger/markAsSeen').markAsSeen
// exports.joinGroup = require('./src/messenger/joinGroup').joinGroup
// exports.leaveGroup = require('./src/messenger/leaveGroup').leaveGroup

// // REST API User Management
// // exports.users = require('./src/express/users-app').users

// // REST API Authentication
// // exports.auth = require('./src/express/auth-app').auth