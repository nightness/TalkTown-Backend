// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
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
import usersApp from './express/users-app'
import authApp from './express/auth-app'
import { secrets } from './express/middleware'

admin.initializeApp({
    credential: admin.credential.cert(secrets.SERVICE_ACCOUNT_TOKEN),
})

const users = functions.https.onRequest(usersApp())
const auth = functions.https.onRequest(authApp())

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
    answerCall,
    users,
    auth,
}
