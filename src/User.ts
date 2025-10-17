import { randomUUID } from "node:crypto";
import { IProduct } from "./Product";

export interface UserDTO {
  name: string;
}
export interface IUser extends UserDTO {
  id: string;
  products: IProduct[];
}
export class User implements IUser {
  id: string;
  name: string;
  products: IProduct[];

  constructor(user: UserDTO) {
    this.id = randomUUID();
    this.name = user.name;
    this.products = [];
  }
}
