import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserProfile } from '../shared'

export default functions.auth.user().onCreate(async (user) => {
    let userProfile: UserProfile = {
        displayName: user.displayName,
        photoURL: user.photoURL,
    }

    // if (user.emailVerified && user.email === 'kvkjvgklwjvlkjwlkvjelkwjvgwlkej')
    //     admin.auth().setCustomUserClaims(user.uid, { admin: true })
    //         .then(() => console.log('Auto added admin to personal account'))
    //         .catch(err => console.log(err))

    await admin.firestore().collection('profiles').doc(user.uid).set(userProfile)
})
