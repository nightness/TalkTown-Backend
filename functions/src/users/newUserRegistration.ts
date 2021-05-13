import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { UserProfile } from '../shared'

export default functions.auth.user().onCreate(async user => {
    // Triggers just return a value or promise
    let userProfile: UserProfile = {
        email: user.email,
        displayName: user.displayName,
    }

    if (user.emailVerified && user.email === 'viipe.com@gmail.com')
        admin.auth().setCustomUserClaims(user.uid, { admin: true })
            .then(() => console.log('Auto added admin to personal account'))
            .catch(err => console.log(err))

    await admin.firestore().collection('profiles').doc(user.uid).set(userProfile)
})