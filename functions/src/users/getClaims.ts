import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async (data, context) => {
    if (data === undefined || data.userId === undefined || data.authToken === undefined)
        return { result: 'Invalid arguments passed' }

    const userInfo = await admin.auth().verifyIdToken(data.authToken)
    if (!userInfo)
        return { result: 'Invalid Authentication' }
    if (!userInfo.admin && !userInfo.manager)
        return { result: 'Permission Denied' }

    try {
        const user = await admin.auth().getUser(data.userId)
        if (!user)
            return { result: 'User not found' }
        const customClaims = user.customClaims
        return { result: 'Success', customClaims }
    }
    catch (err) {
        return { result: err }
    }
})