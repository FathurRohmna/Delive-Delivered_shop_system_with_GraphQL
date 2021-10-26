import { UpdateStatusOrder } from './interfaces/update-order-status.interface';
import { AddressRepository } from './address.repository';
import { CreateOrderInterface } from './interfaces/create-order.interface';
import { OrderRepository } from './order.repository'

export class OrderService {
  private repository = new OrderRepository()
  private addressRepository = new AddressRepository()

  public async getAllOrders() {
    return await this.repository.findMany()
  }

  public async getOrderById(id: string) {
    return await this.repository.findUnique({
      where: {
        id: id
      }
    })
  }

  public async getAddressById(id: string) {
    return await this.addressRepository.findUnique({
      where: {
        id: id
      }
    })
  }

  public async createOrder(data: CreateOrderInterface) {
    const existingAddress = await this.addressRepository.findUnique({
      where: {
        zipCode: data.address.zipCode
      }
    })

    console.log(existingAddress)

    if (existingAddress) {
      const newOrder = await this.repository.create({
        data: {
          userId: data.userId,
          productId: data.productId,
          addressId: existingAddress.id
        }
      })

      return newOrder
    } else {
      const newAddress = await this.addressRepository.create({
        data: {
          zipCode: data.address.zipCode,
          district: data.address.district,
          city: data.address.city,
          county: data.address.county,
          country: data.address.country,
          locationId: data.address.locationId,
        }
      })

      const newOrder = await this.repository.create({
        data: {
          ...data,
          addressId: newAddress.id
        }
      })

      return newOrder
    }
  }

  public async editOrderStatus(data: UpdateStatusOrder) {
    const updateOrder = await this.repository.update({
      where: { 
        id: data.orderId 
      },
      data: {
        status: data.status
      }
    })
    

    return updateOrder
  }

  public async countOrders() {
    return await this.repository.count()
  }
}
