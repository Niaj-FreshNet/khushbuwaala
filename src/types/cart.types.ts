import { IProductResponse } from "./product.types"

export interface CartItem {
  product: IProductResponse
  quantity: number
  selectedSize: string
  selectedPrice: number
  cartItemId?: string
}

