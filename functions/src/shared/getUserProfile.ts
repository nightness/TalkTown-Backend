import * as admin from 'firebase-admin'

export default (async (uid: string) => {
    const userDoc = admin.firestore().collection('profiles').doc(uid)
    const doc = await userDoc.get();
    if (doc.exists) {
        const docData = doc.data()
        if (docData && docData)
            return docData
        throw new Error('Profile not found')
    }
    throw new Error('User not found')
})