import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default functions.https.onCall(async (data, context) => {
    if (data === undefined || data.userId === undefined || data.authToken === undefined || data.claim === undefined)
        return ({ result: 'Invalid arguments passed' })

    const userInfo = await admin.auth().verifyIdToken(data.authToken)
    if (!userInfo)
        return ({ result: 'Invalid Authentication' })
    if (!userInfo.admin && !userInfo.manager)
        return ({ result: 'Permission Denied' })

    const targetUser = await admin.auth().getUser(data.userId)
    if (!targetUser)
        return ({ result: 'User not found' })

    // Remove or set
    const customClaims = targetUser.customClaims || {}
    if (!data.value)
        delete customClaims[data.claim]
    else
        customClaims[data.claim] = data.value

    return admin.auth().setCustomUserClaims(data.userId, customClaims)
        .then(() => ({ result: 'Success', customClaims }))
        .catch(err => ({ result: err }))
})