import { PrismaRepository } from './../../commons/prisma/prisma.repository'

export class ProductRepository {
  prisma = new PrismaRepository()

  findMany = this.prisma.product.findMany
  findUnique = this.prisma.product.findUnique
  create = this.prisma.product.create
  delete = this.prisma.product.delete
  count = this.prisma.product.count
}
