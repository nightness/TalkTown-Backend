import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserProfile } from '../shared'
import { error } from '../shared/errorHandling'

///
/// setProfile
///
export default functions.https.onCall(async (data, context) => {
    if (data === undefined) return { result: 'Invalid arguments passed' }
    const currentUserUid = context.auth ? context.auth.uid : null
    if (!currentUserUid) return error('You must be authenticated to use this function')

    const userInfo = await admin.auth().getUser(currentUserUid)

    const doc: UserProfile = {}
    // Keep original display
    if (userInfo.displayName) doc.displayName = userInfo.displayName
    // Only allow displayName to be set if it's not already set.
    if (!doc.displayName && data.displayName) doc.displayName = data.displayName
    if (data.theme) doc.theme = data.theme
    if (userInfo.photoURL) doc.photoURL = userInfo.photoURL
    return await admin.firestore().collection('profiles').doc(userInfo.uid).set(doc)
})
