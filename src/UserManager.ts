import { IUser, User, UserDTO } from "./User";

export class UserManager {
  constructor(private users: IUser[] = []) {}
  createUser(userDTO: UserDTO) {
    const newUser = new User(userDTO);
    this.users.push(newUser);
    return newUser;
  }
  getUsers() {
    return [...this.users];
  }
}
