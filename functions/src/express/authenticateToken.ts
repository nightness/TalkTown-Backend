import * as jwt from 'jsonwebtoken'
import * as admin from 'firebase-admin'

export const secrets = require('../../secrets.json')

export type Middleware = (req: any, res: any, next: any) => Promise<any>

const setAuthToken = async (
    req: { headers: { authorization: any }; authToken: any },
    res: any,
    next: () => void
) => {
    const authHeader = req.headers && req.headers.authorization
    const authHeaderTokens = authHeader ? authHeader.split(' ') : ['', '']
    const token = authHeaderTokens[0] === 'Bearer' ? authHeaderTokens[1] : null

    req.authToken = token

    return next()
}

const authenticateToken = async (
    req: { authToken: string; user: any },
    res: {
        status: (arg0: number) => {
            (): any
            new (): any
            send: { (): void; new (): any }
        }
    },
    next: () => void
) => {
    // Require authentication
    if (!req.authToken) return res.status(401).send()

    return jwt.verify(
        req.authToken,
        secrets.ACCESS_TOKEN_SECRET,
        (err: any, user: any) => {
            if (err) return res.status(403).send()
            req.user = user
            return next()
        }
    )
}

const authenticateFirebaseToken = async (
    req: { authToken: string; claims: { admin: any } },
    res: {
        status: (arg0: number) => { (): any; new (): any; send: { (): any; new (): any } }
    },
    next: () => Promise<any>
) => {
    // Require authentication (Unauthorized)
    if (!req.authToken) return res.status(401).send()

    // https://firebase.google.com/docs/auth/admin/custom-claims
    const userInfo = await admin.auth().verifyIdToken(req.authToken)
    const result = userInfo.getIdTokenResult()
    req.claims = result.claims

    //console.log(`id = ${Boolean(claims)}`)

    // Forbidden
    if (!req.claims || !req.claims.admin) return res.status(403).send()

    // Call next middleware
    return next()
}

export { setAuthToken, authenticateToken, authenticateFirebaseToken }
