import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async (data, context) => {
    if (!context.auth) return { error: 'Not Authenticated' }

    if (!context.auth.token.admin) return { error: 'Permission Denied' }

    if (data === undefined || typeof data.id !== 'string' || data.answer === undefined)
       return { error: 'Invalid arguments passed' }

    const callDoc = admin.firestore().collection('calls').doc(data.id)
    const existing = (await callDoc.get()).data()

    if (!existing || !existing.target || existing.target !== context.auth.uid)
        return { error: `No such call was found: ${data.id}` }

    try {
        const result = await callDoc.update({ answer: data.answer })
        return { success: result }
    } catch (error) {
        return { error }
    }
})
