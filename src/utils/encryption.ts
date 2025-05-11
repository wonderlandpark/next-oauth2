import crypto from 'crypto'


export function hash(text: string, salt?: string) {
  const hash = crypto.pbkdf2Sync(text, salt || 'asdf', 201, 64, 'sha512')
  return hash.toString('hex')
}