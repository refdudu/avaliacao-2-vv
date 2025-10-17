import { IUser, User, UserDTO } from "./User";

export class UserManager {
  constructor(private users: IUser[] = []) {}
  createUser(userDTO: UserDTO) {
    const newUser = new User(userDTO);
    this.users.push(newUser);
    return newUser;
  }
  getUsers({ name }: { name?: string } = {}): IUser[] {
    if (name) {
      const searchTerm = name.trim().toLowerCase();
      return this.users.filter((user) =>
        user.name.trim().toLowerCase().includes(searchTerm)
      );
    }
    return [...this.users];
  }
}
