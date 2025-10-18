import { InventoryManager } from "@/InventoryManager";
import { UserManager } from "@/UserManager";

describe("Integração - Usuário e Inventário", () => {
  let userManager: UserManager;
  let inventoryManager: InventoryManager;

  beforeEach(() => {
    userManager = new UserManager();
    inventoryManager = new InventoryManager();
  });

  it("deve adicionar um produto existente a um usuário", () => {
    const user = userManager.createUser({ name: "Usuário B" });

    inventoryManager.createProduct({
      name: "Mouse Gamer",
      price: 150,
      quantity: 10,
    });
    const products = inventoryManager.getProducts();

    userManager.setUserProducts(user.id, products);
    const userFromDb = userManager.getUserById(user.id);

    expect(userFromDb.products).toHaveLength(1);
    expect(userFromDb.products[0].name).toBe("Mouse Gamer");
    expect(userFromDb.name).toBe("Usuário B");
  });
});
