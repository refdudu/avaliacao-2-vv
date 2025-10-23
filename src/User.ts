import { randomUUID } from "node:crypto";
import { Product } from "./Product";

export interface UserDTO {
  name: string;
}
export interface IUser extends UserDTO {
  id: string;
  products: Product[];
}
export class User implements IUser {
  id: string;
  name: string;
  products: Product[];

  constructor(user: UserDTO) {
    this.id = randomUUID();
    this.name = user.name;
    this.products = [];
  }
  setProducts(products: Product[]) {
    this.products = products;
  }

}
