<!-- Comment -->
# Cloud Lightning Backend

This is the backend for [cloud-lightning-messenger](https://github.com/nightness/cloud-lightning-messenger); a OpenSource flexible chat system. It supports private, public, and group messages (with voice support coming soon). The cloud-lightning-messenger client is built using React Native, more specifically Expo 41; supporting Android, iOS, and Web builds. This backend uses Firebase, for the easy setup; but support for MongoDB is in planning.

You can visit the live site @ [Cloud Lightning Web App](https://cloud-lightning.web.app/)

## Setup

```
npm i -g expo-cli firebase-tools
npm install
```

## Configure
1. Setup a new (or use an existing) firebase project. I also recommend that you double check project settings right away.
2. Click on the 'web button' above the `Add an app to get started` text.
3. Give your app an arbitrary nickname and click the `Register App` button.
4. Create a service account. If you need help with this, see the [Google Cloud Team's video](https://www.youtube.com/watch?v=tSnzoW4RlaQ) or the [documentation](https://cloud.google.com/iam/docs/creating-managing-service-accounts).
5. Create a `src/secrets.json` file that looks like this...
```
{
  "SERVICE_ACCOUNT_TOKEN": {
    "type": "service_account",
    "project_id": "[PROJECT ID]",
    "private_key_id": "[PRIVATE KEY ID]",
    "private_key": "[PRIVATE KEY]",
    "client_email": "[CLIENT EMAIL]",
    "client_id": "[CLIENT ID]",
    "auth_uri": "[AUTH URI]",
    "token_uri": "[TOKEN URI]",
    "auth_provider_x509_cert_url": "[AUTH CERT PROVIDER]",
    "client_x509_cert_url": "[CLIENT CERT URL]"
  }
}
```
6. Update the above template with the information Google Cloud gives you.
7. In the CLI, run `firebase init` and setup for functions, firestore, and emulators (optional).
8. Still in the CLI, deploy the functions to Firestore with `firebase deploy --only firestore`

# Firebase text messenging service

-   Since it relies on Firestore, there is no need for push notifications; instead uses local notifications watching for snapshot changes in FireStore collections.
-   Each message is in it's own document in a collection.
-   All message posting is handled using firebase functions.
-   While walls and groups are not, the data for private messages is duplicated (normal for a non-SQL database). This makes new message detection simpler.
-   Isolates critical text communications by keeping everything cloud based. Firebase / Firestore have excellent offline support as well.
-   Firestore (used in this way) is very affordable.
-   Can be integrated with existing authentication systems. While it does require logging in with Firebase Authentication; this process can be completely automated away with a member creation REST API. When a new member is added, the REST API will return a custom authentication token for that member.
-   [In Development] Notification badges (In DrawerContent and in expo)
-   [In Development] Each document with a messages    sub-collection should contain a 'recent' (messages) field. This will allows a single document read to initialize the state of the entire (message) view component on the front-end.
-   [Future] Handles isSeen and seenCounts
-   [Future] Encrypted messages, this can always be done client side too.

# Firestore Database Layout

## The collection of all member
### Fields for /profiles/{memberId}

| Name        | Type   | Description            |
| ----------- | ------ | ---------------------- |
| displayName | string | The member's name      |
| photoURL    | string | The member's photo URL |

#

## Group Details
### Fields for /groups/{groupId}

| Name    | Type   | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| name    | string | Name for the group                                  |
| members | array  | Contains an array memberId's                        |
| recent  | array  | Contains an array of the most recent group messages |

#

## Group and Wall Messages
### Fields for walls and groups

#### &nbsp;&nbsp;&nbsp;/groups/{groupId}/messages/{messageId}

#### &nbsp;&nbsp;&nbsp;/walls/{memberId}/messages/{messageId}

| Name           | Type        | Description                  |
| -------------- | ----------- | ---------------------------- |
| authorName     | string      | Display name                 |
| authorUid      | string      | member's ID token            |
| authorPhotoUrl | string      | member's Photo URL           |
| message        | string      | The text of the message      |
| postedAt       | timestamp   | When the message was posted  |
| location       | geolocation | Where the message was posted |
| seenCount      | number      | The number of other member's that have seen the message |

#

## Fields for private messages

### Private message are duplicated...

#### &nbsp;&nbsp;&nbsp;/messages/{ownerMemberId}/{sendingMemberId}/{messageId}

#### &nbsp;&nbsp;&nbsp;/messages/{sendingMemberId}/{ownerMemberId}/{messageId}

| Name           | Type        | Description                                     |
| -------------- | ----------- | ----------------------------------------------- |
| authorName     | string      | Display name                                    |
| authorUid      | string      | member's ID token                               |
| senderPhotoUrl | string      | member's Photo URL                              |
| message        | string      | The text of the message                         |
| postedAt       | timestamp   | When the message was posted                     |
| location       | geolocation | Where the message was posted                    |
| isSeen         | boolean     | True if messages has been seen by the recipient. Default is false. |
