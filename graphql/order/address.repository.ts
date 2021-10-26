import { PrismaRepository } from './../../commons/prisma/prisma.repository'

export class AddressRepository {
  prisma = new PrismaRepository()

  findUnique = this.prisma.address.findUnique
  create = this.prisma.address.create
}