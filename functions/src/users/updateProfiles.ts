import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { error } from '../shared/errorHandling'

///
/// updateProfiles
///
export default functions.https.onCall(async (data, context) => {
    const currentUserUid = context.auth ? context.auth.uid : null
    if (!currentUserUid) return error('You must be authenticated to use this function')

    const collectionRef = admin.firestore().collection('profiles')
    const collection = await collectionRef.get()
    const docs = collection.docs
    if (!docs || docs.length === 0) return error('No profiles Found')

    const promises: Promise<any>[] = []

    docs.forEach(async (docRef) => {
        const userInfo = await admin.auth().getUser(docRef.id)
        if (userInfo && userInfo.displayName)
            promises.push(
                collectionRef.doc(docRef.id).update({ displayName: userInfo.displayName })
            )
    })

    return { result: await Promise.all(promises) }
})
