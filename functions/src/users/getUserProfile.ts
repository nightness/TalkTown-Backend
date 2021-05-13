
import * as functions from 'firebase-functions'
import * as errorGenerator from '../shared/errorHandling'
import getUserProfile from '../shared/getUserProfile'

export default functions.https.onCall(async (data, context) => {
    const currentUserUid = context.auth ? context.auth.uid : null;
    if (!currentUserUid)
        return errorGenerator.error('You must be authenticated to use this function')

    if (!data || !data.userId || typeof data.userId !== 'string')
        return errorGenerator.error('userId is a required string argument')

    return await getUserProfile(data.userId)
})