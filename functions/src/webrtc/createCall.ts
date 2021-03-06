import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async ({ target }, context) => {
    if (!context.auth) return { error: 'Not Authenticated' }

    const result = await admin.auth().getUser(context.auth.uid)
    if (!result.emailVerified) return { error: 'Permission Denied: Verify your email address' }

    if (typeof target !== 'string') return { error: 'Invalid arguments passed' }

    const callDoc = admin.firestore().collection('calls').doc()

    try {
        const result = await callDoc.set({
            creator: context.auth.uid,
            target,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        return { success: result, id: callDoc.id }
    } catch (error) {
        return { error }
    }
})
