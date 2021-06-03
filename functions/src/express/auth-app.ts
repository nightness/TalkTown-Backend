import * as express from 'express'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'
import {
    authenticateFirebaseToken,
    setAuthToken,
    Middleware,
    secrets,
} from './authenticateToken'

const auth = () => {
    // Start of express app
    const app = express()

    // Setup cors
    app.use(cors({ origin: true }))

    // For JWT https://youtu.be/mbsmsi7l3r4?t=361
    // app.use(express.json())

    app.post(
        '/',
        setAuthToken as Middleware,
        authenticateFirebaseToken as Middleware,
        async (req, res, next) => {
            const accessToken = jwt.sign(req.body.key, secrets.ACCESS_TOKEN_SECRET)
            res.status(200).json({ accessToken: accessToken })
        }
    )

    return app
}

// Setup cloud function
export default auth
