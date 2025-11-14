import {
  CheckIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import React, {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import type { IUser } from "./interfaces/User";
import { type IProduct } from "./interfaces/Product";
import { useDebounce } from "./hooks/useDebounce";
import { useClickoutSide } from "./hooks/useClickoutSide";
import { useProductMain } from "./hooks/useProductMain";
import { useUsers } from "./hooks/useUsers";

function App() {
  const userUtils = useUsers();
  return (
    <div className="flex min-h-screen bg-linear-to-br from-blue-400 via-cyan-500 to-indigo-600">
      <UserSidebar {...userUtils} />
      <ProductMain {...userUtils} />
    </div>
  );
}

interface UserSidebarProps {
  users: IUser[];
  selectedUser: IUser | null;
  setSelectedUserId: (userId: string) => void;
  handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteUser: (userId: string) => void;
  getUsers: (name: string) => void;
}
const UserSidebar = ({
  users,
  selectedUser,
  setSelectedUserId: setSelectedUser,
  handleCreateUser: _handleCreateUser,
  handleDeleteUser,
  getUsers,
}: UserSidebarProps) => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const [userName, setUserName] = useState("");
  const debouncedUserName = useDebounce(userName);

  const closeIsCreatingUser = () => setIsCreatingUser(false);
  const openIsCreatingUser = () => setIsCreatingUser(true);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    await _handleCreateUser(e);
    closeIsCreatingUser();
  };

  const handleGetUsers = () => getUsers(userName);

  useEffect(() => {
    handleGetUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUserName]);

  useClickoutSide(isCreatingUser, closeIsCreatingUser, ref);

  return (
    <aside className="w-96 bg-white/90 backdrop-blur-sm shadow-xl p-6 border-r border-white/20 flex flex-col gap-6 h-screen overflow-y-auto">
      <header className="flex items-center gap-4 justify-between">
        <h2
          onDoubleClick={handleGetUsers}
          className="text-3xl font-bold text-blue-800 text-center"
        >
          Usuários
        </h2>
        <button
          onClick={openIsCreatingUser}
          aria-label="Adicionar usuário"
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
              <UserCard
                key={user.id}
                {...{ user, isSelected, setSelectedUser, handleDeleteUser }}
              />
            );
          })}
          {isCreatingUser && (
            <CreateUserCard ref={ref} {...{ handleCreateUser }} />
          )}
        </ul>
      </main>
    </aside>
  );
};
interface UserCardProps {
  user: IUser;
  isSelected: boolean;
  setSelectedUser: (userId: string) => void;
  handleDeleteUser: (userId: string) => void;
}
const UserCard = ({
  user,
  isSelected,
  setSelectedUser,
  handleDeleteUser,
}: UserCardProps) => {
  return (
    <li data-testid="user-card" key={user.id} className="w-full flex items-center gap-4">
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
      <DeleteButton
        aria-label="Deletar usuário"
        onClick={() => handleDeleteUser(user.id)}
      />
    </li>
  );
};
const DeleteButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
  >
    <TrashIcon size={20} />
  </button>
);
const CreateUserCard = React.forwardRef<
  HTMLLIElement,
  {
    handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => void;
  }
>(({ handleCreateUser }, ref) => {
  return (
    <li
      ref={ref}
      data-testid="create-user-form"
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

export interface ProductMainProps {
  selectedUser: IUser | null;
  changeProducts: (products: IProduct[]) => void;
}
const ProductMain = (props: ProductMainProps) => {
  const { selectedUser } = props;
  const userProducts = selectedUser ? selectedUser.products : [];

  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeCreatingProduct = () => setIsCreatingProduct(false);

  const {
    removeProduct,
    addProductQuantity,
    removeProductQuantity,
    handleCreateProduct,
  } = useProductMain({ ...props, closeCreatingProduct });

  useClickoutSide(isCreatingProduct, closeCreatingProduct, ref);

  return (
    <main className="flex-1 p-6 h-screen overflow-y-auto">
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
        <div>
          {selectedUser && (
            <button
              onClick={() => setIsCreatingProduct(true)}
              disabled={!selectedUser}
              aria-label="Adicionar produto"
              className="bg-linear-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              Criar produto <PlusIcon size={20} />
            </button>
          )}
        </div>
      </header>
      <div className="space-y-4">
        {isCreatingProduct && (
          <CreateProductCard
            ref={ref}
            handleCreateProduct={handleCreateProduct}
          />
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

const CreateProductCard = React.forwardRef<
  HTMLDivElement,
  { handleCreateProduct: (e: React.FormEvent<HTMLFormElement>) => void }
>(({ handleCreateProduct }, ref) => {
  return (
    <div
      ref={ref}
      data-testid="create-product-form"
      className="bg-cyan-100 p-6 rounded-2xl border-2 border-cyan-300 shadow-lg"
    >
      <form onSubmit={handleCreateProduct} className="flex gap-4 flex-wrap">
        <ProductCardInput
          autoFocus
          name="name"
          type="text"
          placeholder="Nome do produto"
        />
        <ProductCardInput
          name="price"
          type="number"
          step="0.01"
          placeholder="Preço"
        />
        <ProductCardInput
          name="quantity"
          type="number"
          placeholder="Quantidade"
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
});
const ProductCardInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  return (
    <input
      {...props}
      required
      className="flex-1 border-2 border-cyan-400 p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 bg-white"
    />
  );
};

interface ProductCardProps {
  product: IProduct;
  handleDelete: () => void;
  addChangeQuantity: () => void;
  removeChangeQuantity: () => void;
}
const ProductCard = ({
  product,
  addChangeQuantity,
  removeChangeQuantity,
  handleDelete,
}: ProductCardProps) => {
  return (
    <div data-testid="product-card" className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 flex items-center justify-between hover:shadow-2xl transition-all duration-300 transform hover:scale-102">
      <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
      <p className="text-lg text-blue-600 font-bold bg-blue-100 px-4 py-2 rounded-full">
        Preço: R$ {product.price.toFixed(2)}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Quantidade:</span>
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
          <button
            onClick={removeChangeQuantity}
            aria-label="Remover quantidade"
            className="bg-red-500 text-white h-10 w-10 flex items-center justify-center rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <MinusIcon size={20} />
          </button>
          <span className="w-20 text-center py-2 bg-white rounded-lg font-bold text-gray-800 shadow-inner">
            {product.quantity}
          </span>
          <button
            onClick={addChangeQuantity}
            aria-label="Adicionar quantidade"
            className="bg-blue-500 text-white h-10 w-10 flex items-center justify-center rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <PlusIcon size={20} />
          </button>
        </div>
      </div>
      <DeleteButton aria-label="Deletar produto" onClick={handleDelete} />
    </div>
  );
};
export default App;
