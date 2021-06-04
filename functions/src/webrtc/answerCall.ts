import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async ({ id, answer }, context) => {
    if (!context.auth) return { error: 'Not Authenticated' }

    const result = await admin.auth().getUser(context.auth.uid)
    if (!result.emailVerified) return { error: 'Permission Denied' }

    if (typeof id !== 'string' || answer === undefined)
        return { error: 'Invalid arguments passed' }

    const callDoc = admin.firestore().collection('calls').doc(id)
    const existing = (await callDoc.get()).data()

    if (!existing || !existing.target || existing.target !== context.auth.uid)
        return { error: `No such call was found: ${id}` }

    try {
        const result = await callDoc.update({ answer })
        return { success: result }
    } catch (error) {
        return { error }
    }
})
