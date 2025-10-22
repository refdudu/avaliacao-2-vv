export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IUser {
  id: string;
  name: string;
  products: IProduct[];
}

export interface ProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export interface UserDTO {
  name: string;
}
