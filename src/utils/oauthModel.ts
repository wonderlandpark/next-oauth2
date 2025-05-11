import prisma from '@/utils/prisma'
import type { Client, User, Token, AuthorizationCode } from '@node-oauth/oauth2-server'

import type { Scope } from '@prisma/client'
import { hash } from './encryption'
import { TOKEN_EXPIRES_AT } from '@/utils/constants'



export const getClient = async (clientId: string, clientSecret: string): Promise<Client | null> => {
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client || client.secret !== clientSecret) return null
  return { id:  client.id, grants: client.grants, redirectUris: client.redirectUris, accessTokenLifetime: TOKEN_EXPIRES_AT }
}

export const getUser = async (username: string, password: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { username }})
  console.log(hash(password, user?.id))
  if(user?.password !== hash(password, user?.id)) return null
  return { id: user.id, username: user.username, email: user.email }
}

export const getAccessToken = async (accessToken: string) => {
  const token = await prisma.token.findFirst({ where: { accessToken } })
  const client = await prisma.client.findUnique({ where: { id: token?.clientId } })

  if (!token || !client) return null
  return { accessToken, accessTokenExpiresAt: token.expiresAt, scope: token.scope, client: { id: token.clientId, grants: client.grants, name: client.name }, user: { id: token.userId } } 
}
  
export const getAuthorizationCode = async (code: string) => {
  const authCode = await prisma.authorizationCode.findUnique({ where: { code } })

  return { 
    authorizationCode: code,
    expiresAt: authCode?.expiresAt,
    redirectUri: authCode?.redirectUri,
    scope: authCode?.scope,
    client: { id: authCode?.clientId },
    user: { id: authCode?.userId }
  }
}
export const saveToken = async (token: Token, client: Client, user: User) => {
  await prisma.token.create({
    data: {
      accessToken: token.accessToken,
      expiresAt: token.accessTokenExpiresAt!,
      userId: user.id,
      clientId: client.id,
      scope: token.scope as Scope[],
    }
    })
  if(token.refreshToken) {await prisma.refreshToken.create({
    data: {
      refreshToken: token.refreshToken,
      expiresAt: token.refreshTokenExpiresAt!,
      userId: user.id,
      clientId: client.id,
      scope: token.scope as Scope[],

    }
  })}
    return { accessToken: token.accessToken, accessTokenExpiresAt: token.accessTokenExpiresAt, refreshToken: token.refreshToken, refreshTokenExpiresAt: token.refreshTokenExpiresAt, scope: token.scope, client: { id: client.id, grants: client.grants }, user: { id: user.id } }
  }


export const saveAuthorizationCode = async (code: AuthorizationCode , client: Client, user: User) => {
  await prisma.authorizationCode.create({
    data: {
      code: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope as Scope[],
      userId: user.id,
      clientId: client.id,
    }
  })

  return { authorizationCode: code.authorizationCode, expiresAt: code.expiresAt, redirectUri: code.redirectUri, scope: code.scope, client: { id: client.id }, user: { id: user.id } }
}

export const revokeAuthorizationCode = async (code: AuthorizationCode) => {
  const target = await prisma.authorizationCode.delete({ where: { code: code.authorizationCode } })
  return target ? true : false
}