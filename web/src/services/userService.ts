import type { IUser, UserDTO } from "../interfaces/User";
import { api } from "../utils/api";

export const userService = {
  getUsers: (name: string): Promise<IUser[]> =>
    api.get("/users", { params: { name } }),
  createUser: (user: UserDTO): Promise<IUser> => api.post("/users", user),
  deleteUser: (userId: string): Promise<void> => api.delete(`/users/${userId}`),
};
