import { useState } from "react";
import UserList from "./components/UserList";
import { ProductList } from "./components/ProductList";
import { UserDetail } from "./components/UserDetail";

type View = "users" | "products" | "user-detail";

function App() {
  const [view, setView] = useState<View>("users");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setView("user-detail");
  };

  const handleBackToUsers = () => {
    setSelectedUserId(null);
    setView("users");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Gerenciamento
          </h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setView("users")}
              className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                view === "users" || view === "user-detail"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setView("products")}
              className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                view === "products"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Produtos
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === "users" && <UserList onViewUser={handleViewUser} />}
        {view === "products" && <ProductList />}
        {view === "user-detail" && selectedUserId && (
          <UserDetail userId={selectedUserId} onBack={handleBackToUsers} />
        )}
      </main>
    </div>
  );
}

export default App;
