import { PrismaClient } from '@prisma/client'
import { fieldEncryptionExtension } from 'prisma-field-encryption'

const prisma = new PrismaClient()

export default prisma.$extends(fieldEncryptionExtension({ encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY! }))

