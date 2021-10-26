import { CreateProductInterface } from './interfaces/create-product.interface';
import { ProductRepository } from './product.repository'

export class ProductService {
  private repository = new ProductRepository()

  public async getAllProducts() {
    const products =  await this.repository.findMany({
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    return products
  }

  public async getProductById(id: string) {
    return await this.repository.findUnique({
      where: {
        id: id
      }
    })
  }

  public async createProduct(shopData: CreateProductInterface) {
    return await this.repository.create({
      data: shopData
    })
  }

  public async deleteProductById(id: string) {
    return await this.repository.delete({
      where: {
        id: id
      }
    })
  }

  public async countProduct() {
    return await this.repository.count()
  }
}
