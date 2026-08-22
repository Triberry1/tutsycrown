import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

class PrismaClientSingleton {
  static instance: PrismaClient

  static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      const connectionString = process.env.DATABASE_URL
      if (!connectionString) {
        throw new Error('DATABASE_URL is required to initialize Prisma')
      }

      const adapter = new PrismaPg({ connectionString })
      const client = new PrismaClient({ adapter })

      PrismaClientSingleton.instance = client
    }
    return PrismaClientSingleton.instance
  }
}

export const prisma = PrismaClientSingleton.getInstance()
export const resetPrismaInstance = () => {
  PrismaClientSingleton.instance = undefined as unknown as PrismaClient
}