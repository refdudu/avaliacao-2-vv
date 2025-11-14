export interface ProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export interface IProduct extends ProductDTO {
  id: string;
}
