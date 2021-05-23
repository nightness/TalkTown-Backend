import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async (data, context) => {
    if (!context.auth)
        return ({ error: 'Not Authenticated' })
        
    if (!context.auth.token.admin)
        return ({ error: 'Permission Denied' })

    if (data === undefined || typeof data.target !== 'string')
        return ({ error: 'Invalid arguments passed' })

    const callDoc = admin.firestore().collection('calls').doc()

    try {
        const result = await callDoc.set({
            creator: context.auth.uid,
            target: data.target,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        return ({ success: result, id: callDoc.id })
    } catch (error) {
        return ({ error })
    }
})