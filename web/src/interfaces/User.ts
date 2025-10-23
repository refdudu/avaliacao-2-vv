import type { IProduct } from "./Product";

export interface UserDTO {
  name: string;
}
export interface IUser extends UserDTO {
  id: string;
  products: IProduct[];
}
