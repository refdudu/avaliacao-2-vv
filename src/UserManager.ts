import { normalizeString } from "./normalizeString";
import { IUser, User, UserDTO } from "./User";

interface GetUserFilter {
  name?: string;
}

export class UserManager {
  constructor(private users: IUser[] = []) { }

  createUser(userDTO: UserDTO) {
    const newUser = new User(userDTO);
    this.users.push(newUser);
    return newUser;
  }

  getUsers({ name }: GetUserFilter = {}): IUser[] {
    if (!name) {
      return [...this.users];
    }

    const normalizedName = normalizeString(name);
    return this.users.filter((user) =>
      normalizeString(user.name).includes(normalizedName)
    );
  }
  deleteUser(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
      return true;
    }
    return false;

  }
}
