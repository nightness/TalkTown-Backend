import * as admin from 'firebase-admin'

///
/// getGroupMembers
///
export const getGroupMembers = async (groupId: string) => {
    if (typeof groupId !== 'string') throw new Error('Bad Call')

    const docRef = admin.firestore().collection('groups').doc(groupId)
    const doc = await docRef.get()
    const data = doc.exists ? doc.data() : undefined
    return (data as FirebaseFirestore.DocumentData).members as string[]
}

///
/// setNotifications
///
export const setNotifications = async (
    userIds: string[],
    groupId: string,
    reset = false,
    remove = false
) => {
    const collectionRef = admin.firestore().collection('notifications')
    userIds.map(async (userId) => {
        const docRef = collectionRef.doc(userId)
        const doc = await docRef.get()
        const data = doc.exists ? doc.data() : { groups: {} }
        const notifications = data ? data : { groups: {} }

        if (!notifications.groups) notifications.groups = {}

        // Make changes
        if (remove && notifications.groups[groupId] !== undefined) {
            delete notifications.groups[groupId]
        } else {
            // reset or increase the count of unseen messages for the specified group
            notifications.groups[groupId] = reset
                ? 0
                : notifications.groups[groupId]
                ? notifications.groups[groupId] + 1
                : 1
        }
        // Write the notifications doc
        await docRef.set(notifications)
    })
}
