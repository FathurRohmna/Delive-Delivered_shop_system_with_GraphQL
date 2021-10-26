interface Address {
  zipCode: number
  district: string
  city: string
  cunty: string 
  country: string
  locationId: string
}

export interface CreateOrderInterface {
  userId: string
  productId: string
  address: Address
  shopId: string
}