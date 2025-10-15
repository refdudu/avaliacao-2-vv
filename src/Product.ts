import { randomUUID } from "node:crypto";

export interface ProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export class Product {
  readonly id: string;
  name: string;
  price: number;
  quantity: number;

  constructor(productDTO: ProductDTO) {
    this.id = randomUUID();
    this.name = productDTO.name;
    this.price = productDTO.price;
    this.quantity = productDTO.quantity;
  }

  addQuantity(quantity: number): void {
    this.quantity += quantity;
  }
}