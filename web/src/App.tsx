import {
  CheckIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import type { IUser, UserDTO } from "./interfaces/User";
import { type IProduct } from "./interfaces/Product";
import { userService } from "./services/userService";
import { useDebounce } from "./utils/useDebounce";

function App() {
  const [users, setUsers] = useState<IUser[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = users.find((user) => user.id === selectedUserId) || null;

  const getUsers = async (name: string) => {
    try {
      const data = await userService.getUsers(name);
      setUsers(data);
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
        setSelectedUserId(null);
      }
    } catch (e) {
      alert(JSON.stringify(e, null, 4));
    }
  };

  useEffect(() => {
    getUsers("");
  }, []);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-blue-400 via-cyan-500 to-indigo-600">
      <UserSidebar
        {...{
          selectedUser,
          setSelectedUser: setSelectedUserId,
          users,
          handleCreateUser,
          handleDeleteUser,
          getUsers,
        }}
      />
      <ProductMain
        {...{
          selectedUser,
          changeProducts: (products: IProduct[]) => {
            if (selectedUser) {
              setUsers((prev) =>
                prev.map((user) =>
                  user.id === selectedUser.id ? { ...user, products } : user
                )
              );
            }
          },
        }}
      />
    </div>
  );
}

const UserSidebar = ({
  users,
  selectedUser,
  setSelectedUser,
  handleCreateUser,
  handleDeleteUser,
  getUsers,
}: {
  users: IUser[];
  selectedUser: IUser | null;
  setSelectedUser: (userId: string) => void;
  handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteUser: (userId: string) => void;
  getUsers: (name: string) => void;
}) => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const [userName, setUserName] = useState("");
  const debouncedUserName = useDebounce(userName);

  const closeIsCreatingUser = () => setIsCreatingUser(false);
  const openIsCreatingUser = () => setIsCreatingUser(true);

  const _handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleCreateUser(e);
    closeIsCreatingUser();
  };

  useEffect(() => {
    if (!isCreatingUser) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsCreatingUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreatingUser]);

  const handleGetUsers = () => getUsers(userName);
  useEffect(() => {
    handleGetUsers();
  }, [debouncedUserName]);

  return (
    <aside className="w-96 bg-white/90 backdrop-blur-sm shadow-xl p-6 border-r border-white/20 flex flex-col gap-6">
      <header className="flex items-center gap-4 justify-between">
        <h2
          onDoubleClick={handleGetUsers}
          className="text-3xl font-bold text-blue-800 text-center"
        >
          Usuários
        </h2>
        <button
          onClick={openIsCreatingUser}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusIcon size={24} />
        </button>
      </header>
      <div className="">
        <input
          onChange={(e) => setUserName(e.currentTarget.value)}
          value={userName}
          type="text"
          className="w-full border-2 border-blue-300 p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 bg-white/80"
          placeholder="Digite o nome do usuário"
        />
      </div>
      <main>
        <ul className="space-y-3">
          {users.map((user) => {
            const isSelected = selectedUser?.id === user.id;
            return (
              <li key={user.id} className="w-full flex items-center gap-4">
                <button
                  className={`flex-1 text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-102 ${
                    isSelected
                      ? "bg-blue-200 text-blue-900 font-bold shadow-lg border-2 border-blue-400"
                      : "text-gray-800 hover:bg-blue-100 hover:shadow-md border border-gray-200"
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <TrashIcon size={20} />
                </button>
              </li>
            );
          })}
          {isCreatingUser && (
            <CreateUserCard
              ref={ref}
              {...{ handleCreateUser: _handleCreateUser }}
            />
          )}
        </ul>
      </main>
    </aside>
  );
};
const CreateUserCard = React.forwardRef<
  HTMLLIElement,
  {
    handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => void;
  }
>(({ handleCreateUser }, ref) => {
  return (
    <li
      ref={ref}
      className="p-4 bg-cyan-100 rounded-xl border-2 border-cyan-300"
    >
      <form onSubmit={handleCreateUser} className="flex gap-3">
        <input
          type="text"
          placeholder="Nome do usuário"
          required
          autoFocus
          name="name"
          className="flex-1 border-2 border-cyan-400 p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 bg-white"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <CheckIcon size={24} />
        </button>
      </form>
    </li>
  );
});

const ProductMain = ({
  selectedUser,
  changeProducts,
}: {
  selectedUser: IUser | null;
  changeProducts: (products: IProduct[]) => void;
}) => {
  const userProducts = selectedUser ? selectedUser.products : [];
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const handleCreateProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string, 10);

    const newProduct: IProduct = {
      id: String(userProducts.length + 1),
      name,
      price,
      quantity,
    };
    changeProducts([...userProducts, newProduct]);
    setIsCreatingProduct(false);
  };

  const removeProduct = (product: IProduct) => {
    changeProducts([...userProducts].filter((item) => item.id !== product.id));
  };
  const addProductQuantity = (product: IProduct): void => {
    updateProductQuantity(product, product.quantity + 1);
  };
  const removeProductQuantity = (product: IProduct): void => {
    updateProductQuantity(product, product.quantity - 1);
  };
  const updateProductQuantity = (product: IProduct, quantity: number): void => {
    changeProducts(
      [...userProducts].map((item) =>
        item.id === product.id ? { ...item, quantity } : item
      )
    );
  };
  return (
    <main className="flex-1 p-6">
      <header className="flex items-center justify-between mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-indigo-800">
          Produtos do Usuário:{" "}
          <span className="text-cyan-600">
            {selectedUser ? selectedUser.name : "Nenhum usuário selecionado"}
          </span>
        </h2>
        <span className="text-lg font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-full">
          Total: {userProducts.length}
        </span>
        <button
          onClick={() => setIsCreatingProduct(true)}
          className="bg-linear-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          Criar produto <PlusIcon size={20} />
        </button>
      </header>
      <div className="space-y-4">
        {isCreatingProduct && (
          <CreateProductCard handleCreateProduct={handleCreateProduct} />
        )}
        {userProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleDelete={() => removeProduct(product)}
            addChangeQuantity={() => addProductQuantity(product)}
            removeChangeQuantity={() => removeProductQuantity(product)}
          />
        ))}
      </div>
    </main>
  );
};

const CreateProductCard = ({
  handleCreateProduct,
}: {
  handleCreateProduct: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div className="bg-cyan-100 p-6 rounded-2xl border-2 border-cyan-300 shadow-lg">
      <form onSubmit={handleCreateProduct} className="flex gap-4 flex-wrap">
        <input
          name="name"
          type="text"
          placeholder="Nome do produto"
          className="flex-1 border-2 border-cyan-400 p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 bg-white"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Preço"
          className="flex-1 border-2 border-cyan-400 p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 bg-white"
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantidade"
          className="flex-1 border-2 border-cyan-400 p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 bg-white"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <CheckIcon size={24} /> Criar
        </button>
      </form>
    </div>
  );
};

const ProductCard = ({
  product,
  addChangeQuantity,
  removeChangeQuantity,
  handleDelete,
}: {
  product: IProduct;
  handleDelete: () => void;
  addChangeQuantity: () => void;
  removeChangeQuantity: () => void;
}) => {
  return (
    <div
      key={product.id}
      className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 flex items-center justify-between hover:shadow-2xl transition-all duration-300 transform hover:scale-102"
    >
      <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
      <p className="text-lg text-blue-600 font-bold bg-blue-100 px-4 py-2 rounded-full">
        Preço: R$ {product.price.toFixed(2)}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Quantidade:</span>
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
          <button
            onClick={() => removeChangeQuantity()}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <MinusIcon size={20} />
          </button>
          <span className="w-20 text-center py-2 bg-white rounded-lg font-bold text-gray-800 shadow-inner">
            {product.quantity}
          </span>
          <button
            onClick={() => addChangeQuantity()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <PlusIcon size={20} />
          </button>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <TrashIcon size={20} />
      </button>
    </div>
  );
};
export default App;
