import * as jwt from 'jsonwebtoken'
import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

import { secrets } from '../secrets'

export type Next = () => void
export type Middleware = (req: Request, res: Response, next: Next) => Promise<any>

interface AuthRequest extends Request {
    authToken?: string
    user?: string
}

const setAuthToken = async (req: AuthRequest, _: Response, next: Next) => {
    const authHeader = req.header('Authorization')
    const authHeaderTokens = authHeader ? authHeader.split(' ') : ['', '']
    const token = authHeaderTokens[0] === 'Bearer' ? authHeaderTokens[1] : undefined

    req.authToken = token

    return next()
}

const authenticateToken = async (req: AuthRequest, res: Response, next: Next) => {
    // Require authentication
    if (!req.authToken) return res.status(401).send()

    return jwt.verify(
        req.authToken,
        secrets.private_key,
        (err: any, user: any) => {
            if (err) return res.status(403).send()
            req.user = user
            return next()
        }
    )
}

const authenticateFirebaseToken = async (req: AuthRequest, res: Response, next: Next) => {
    // Require authentication (Unauthorized)
    if (!req.authToken) return res.status(401).send()

    // https://firebase.google.com/docs/auth/admin/custom-claims
    const userInfo = await admin.auth().verifyIdToken(req.authToken)
    const result = await admin.auth().getUser(userInfo.uid)

    // Forbidden
    if (!result.customClaims || !result.customClaims.admin) return res.status(403).send()

    // Call next middleware
    return next()
}

export { setAuthToken, authenticateToken, authenticateFirebaseToken }
