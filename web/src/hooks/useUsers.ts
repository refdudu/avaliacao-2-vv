import  { useState } from "react";
import type { IProduct } from "../interfaces/Product";
import type { IUser, UserDTO } from "../interfaces/User";
import { userService } from "../services/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = users.find((user) => user.id === selectedUserId) || null;

  const getUsers = async (name: string) => {
    try {
      const data = await userService.getUsers(name);
      setUsers(data);
      setSelectedUserId(data[0]?.id);
    } catch {
      alert("Error fetching users");
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      if (!name) {
        alert("Nome do usuário é obrigatório");
        return;
      }

      const userDTO: UserDTO = {
        name: name,
      };
      const newUser = await userService.createUser(userDTO);
      setUsers([...users, newUser]);
    } catch (e) {
      alert(JSON.stringify(e, null, 4));
    }
  };
  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers((p) => p.filter((user) => user.id !== userId));
      if (selectedUserId === userId) {
        setSelectedUserId(users[0]?.id);
      }
    } catch (e) {
      alert(JSON.stringify(e, null, 4));
    }
  };
  const changeProducts = (products: IProduct[]) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, products } : user
        )
      );
    }
  };
  return {
    selectedUser,
    setSelectedUserId,
    users,
    handleCreateUser,
    handleDeleteUser,
    getUsers,
    changeProducts,
  };
};
