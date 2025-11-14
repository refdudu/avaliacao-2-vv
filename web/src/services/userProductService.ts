import type { IProduct, ProductDTO } from "../interfaces/Product";
import { api } from "../utils/api";

const getBaseUrl = (userId: string) => `/users/${userId}/products`;
export const userProductService = {
  createProduct: (
    userId: string,
    productDTO: ProductDTO
  ): Promise<IProduct[]> => api.post(getBaseUrl(userId), productDTO),
  addProductQuantity: (
    userId: string,
    productId: string
  ): Promise<IProduct[]> => api.patch(`${getBaseUrl(userId)}/${productId}/add`),
  removeProductQuantity: (
    userId: string,
    productId: string
  ): Promise<IProduct[]> =>
    api.patch(`${getBaseUrl(userId)}/${productId}/remove`),
  deleteProduct: (userId: string, productId: string): Promise<IProduct[]> =>
    api.delete(`${getBaseUrl(userId)}/${productId}`),
  //   getUsers: (name: string): Promise<IUser[]> =>
  //     api.get("/users", { params: { name } }),
  //   createUser: (user: UserDTO): Promise<IUser> => api.post("/users", user),
  //   deleteUser: (userId: string): Promise<void> => api.delete(`/users/${userId}`),
};
