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
import answerCall from './webrtc/answerCall'

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
    setCallOffer,
    answerCall
}

// // REST API User Management
// // exports.users = require('./src/express/users-app').users

// // REST API Authentication
// // exports.auth = require('./src/express/auth-app').auth