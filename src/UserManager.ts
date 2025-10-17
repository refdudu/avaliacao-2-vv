import { randomUUID } from "node:crypto";
import { IUser, UserDTO } from "./User";

export class UserManager {
  constructor(private users: IUser[] = []) {}
  createUser(user: UserDTO) {
    const _user = {
      id: randomUUID(),
      ...user,
      products: [],
    };
    this.users.push(_user);
    return _user;
  }
  getUsers() {
    return this.users;
  }
}
