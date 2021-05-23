import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async (data, context) => {
    if (data === undefined)
        return ({ result: 'Invalid arguments passed' })

    if (!context.auth)
        return ({ result: 'Not Authenticated' })
        
    if (!context.auth.token.admin)
        return ({ result: 'Permission Denied' })

    // const targetUser = await admin.auth().getUser(data.userId)
    // if (!targetUser)
    //     return ({ result: 'User not found' })

    const callDoc = admin.firestore().collection('calls').doc()

    try {
        return ({ result: await callDoc.set({ data }) })
    } catch (error) {
        return ({ error })
    }
})