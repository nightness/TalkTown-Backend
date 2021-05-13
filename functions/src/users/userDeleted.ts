import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.auth.user().onDelete(async user => {
    const docs = await admin.firestore().collection('members').doc(user.uid).collection('messages').listDocuments()
    let promises: any = []
    docs.forEach(doc => promises.push(doc.delete()))
    await Promise.all(promises)
    await admin.firestore().collection('members').doc(user.uid).delete()
    await admin.firestore().collection('profiles').doc(user.uid).delete()
})