import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as errorGenerator from '../shared/errorHandling'
import { getGroupMembers, setNotifications } from '../messenger/shared'

const emoji = require('emoji-node')
const Filter = require('bad-words')

///
/// setMessage
///
export default functions.https.onCall(async (data, context) => {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!! Enforce security rules locally!!!
    // !!! Firestore rules do not apply in here so this function must makes those checks!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const currentUserUid = context.auth ? context.auth.uid : null
    if (!currentUserUid)
        return errorGenerator.error('You must be authenticated to use this function')

    if (!data.collectionPath) return errorGenerator.error('collectionPath is required')

    // Prevent zero length messages and non-string messages
    var message = data.message
    if (!message || typeof message !== 'string' || message.length < 1)
        return errorGenerator.silentError(
            'Message length equals zero or message is not a string'
        )

    // Stop bad language posts!
    const filter = new Filter()
    if (filter.isProfane(message)) {
        return errorGenerator.silentError(
            `Remove the profanity in your message before posting!`
        )
    }

    // Process message with emoji, do a Emoticon to Emoji conversion. ;( => 😢
    message = emoji.emojify(message)

    const userInfo = await admin.auth().getUser(currentUserUid)
    if (typeof userInfo.displayName !== 'string')
        return errorGenerator.silentError(
            `No display name is specified in the user's info`
        )

    // Private Messages
    if (!data.documentId) {
        const messagesCollection = admin.firestore().collection(data.collectionPath)
        const addData = {
            authorName: userInfo.displayName,
            authorUid: currentUserUid,
            message: message,
            postedAt: admin.firestore.FieldValue.serverTimestamp(),
            photoURL: userInfo?.photoURL,
        }

        const writeResult1 = await messagesCollection.add(addData)

        if (!data.duplicationPath) return writeResult1

        const duplicateCollection = admin.firestore().collection(data.duplicationPath)
        const writeResult2 = await duplicateCollection.add(addData)

        return { result1: writeResult1, result2: writeResult2 }
    }

    // Public Messages
    const memberDoc = admin
        .firestore()
        .collection(data.collectionPath)
        .doc(data.documentId)
    const messagesCollection = memberDoc.collection('messages')
    const addData = {
        authorName: userInfo.displayName,
        authorUid: currentUserUid,
        message: message,
        postedAt: admin.firestore.FieldValue.serverTimestamp(),
        photoURL: userInfo?.photoURL,
    }

    const writeResult1 = await messagesCollection.add(addData)

    const userIds = await getGroupMembers(data.documentId)
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0)
        return { result1: writeResult1 }

    const writeResult2 = await setNotifications(userIds, data.documentId)

    // setNotifications is always returning null, since it using a loop though userIds
    return { result1: writeResult1, result2: writeResult2 }
})
