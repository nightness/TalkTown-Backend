import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserProfile } from '../shared'

///
/// setProfileAttribute
///
export default functions.https.onCall(async (data, context) => {
    if (
        data === undefined ||
        data.authToken === undefined ||
        data.displayName === undefined
    )
        return { result: 'Invalid arguments passed' }

    const userInfo = await admin.auth().verifyIdToken(data.authToken)
    if (!userInfo) return { result: 'Invalid Authentication' }

    const doc: UserProfile = {}
    if (typeof data.displayName === 'string' && data.displayName !== '')
        doc.displayName = data.displayName
    doc.theme = data?.theme
    doc.photoURL = userInfo?.picture
    return await admin.firestore().collection('profiles').doc(userInfo.uid).set(doc)
})
