import { randomUUID } from "node:crypto";

export interface ProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export class Product implements ProductDTO {
  public readonly id: string; 
  public name: string;
  public price: number;
  public quantity: number;

  constructor(productDTO: ProductDTO) {
    this.id = randomUUID();
    this.name = productDTO.name;
    this.price = productDTO.price;
    this.quantity = productDTO.quantity;
  }
}