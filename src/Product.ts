import { randomUUID } from "node:crypto";

export interface ProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export interface IProduct extends ProductDTO {
  id: string;
}

export class Product implements IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;

  constructor(productDTO: ProductDTO) {
    this.id = randomUUID();
    this.name = productDTO.name;
    this.price = productDTO.price;
    this.quantity = productDTO.quantity;
  }
}