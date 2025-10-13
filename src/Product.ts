export interface ProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export interface Product extends ProductDTO {
  id: string;
}
