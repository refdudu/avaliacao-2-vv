import { randomUUID } from "node:crypto";
import { InsufficientStockError } from "./errors/InsufficientStockError";

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

  addQuantity(amount: number): void {
    this.quantity += amount;
  }

removeQuantity(amount: number): void {
    if (amount > this.quantity) {
      throw new InsufficientStockError();
    }
    this.quantity -= amount;
  }
}