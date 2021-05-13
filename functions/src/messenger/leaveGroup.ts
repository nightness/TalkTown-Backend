import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as errorGenerator from '../shared/errorHandling'
import { setNotifications } from '../messenger/shared'

///
/// Leave Group
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

    const groupInfo = doc.data() as { members: string[] }
    if (!groupInfo.members)
        groupInfo.members = []
    const index = groupInfo.members.indexOf(currentUserUid)
    if (index === -1)
        return errorGenerator.silentError(`You are not joined to ${(groupInfo as any)?.name}`)
    groupInfo.members.splice(index, 1)
    const writeResult = await docRef.set(groupInfo)

    await setNotifications([currentUserUid], data.groupId, false, true)

    return { result: writeResult }
})
