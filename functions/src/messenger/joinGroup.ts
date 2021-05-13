import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as errorGenerator from '../shared/errorHandling'
import { setNotifications } from '../messenger/shared'

///
/// joinGroup
///
export default functions.https.onCall(async (data, context) => {
    const currentUserUid = context.auth ? context.auth.uid : null;
    if (!currentUserUid)
        return errorGenerator.error('You must be authenticated to use this function')

    if (!data || !data.groupId || typeof data.groupId !== 'string')
        return errorGenerator.error('groupId is a required string argument')

    // Join group (add currentUserUid to members)
    const collectionRef = admin.firestore().collection('groups')
    const docRef = collectionRef.doc(data.groupId)
    const doc = await docRef.get()

    if (!doc.exists)
        return errorGenerator.error(`Invalid groupId: ${data.groupId}`)

    const groupInfo = doc.data() as { name: string, members: string[] }
    if (!groupInfo.members)
        groupInfo.members = []

    if (groupInfo.members.indexOf(currentUserUid) === -1) {
        groupInfo.members.push(currentUserUid)
        const writeResult = await docRef.set(groupInfo)
        
        setNotifications([currentUserUid], data.groupId, true)

        return { result: writeResult, message: `You are now joined to ${groupInfo.name}` }
    }

    return errorGenerator.silentError(`You are already joined to ${groupInfo.name}`)
})
