import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as errorGenerator from '../shared/errorHandling'

export default functions.https.onCall(async (data, context) => {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!! Enforce security rules locally!!!
    // !!! Firestore rules do not apply in here so this function must makes those checks!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const currentUserUid = context.auth ? context.auth.uid : null;
    if (!currentUserUid)
        return errorGenerator.error('You must be authenticated to use this function')
    
    const collectionRef = admin.firestore().collection('notifications')
    const docRef = collectionRef.doc(currentUserUid)
    const doc = await docRef.get()

    return { result: 'Success', data: doc.exists ? doc.data() : { groups: { } } }
})
