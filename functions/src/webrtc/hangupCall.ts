import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async ({ id, answer }, context) => {
    if (!context.auth) return { error: 'Not Authenticated' }

    if (typeof id !== 'string') return { error: 'Invalid arguments passed' }

    const callDoc = admin.firestore().collection('calls').doc(id)
    const existing = (await callDoc.get()).data()

    if (
        !existing ||
        (existing.target !== context.auth.uid && existing.creator !== context.auth.uid)
    )
        return { error: `No such call was found: ${id}` }

    try {
        const result = await callDoc.delete()
        return { success: result }
    } catch (error) {
        return { error }
    }
})
