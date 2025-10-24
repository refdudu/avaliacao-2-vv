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

  it("deve gerenciar múltiplos produtos de múltiplos usuários e manter integridade após deleção", () => {
    const user1 = userManager.createUser({ name: "Alice" });
    const user2 = userManager.createUser({ name: "Bob" });
    const user3 = userManager.createUser({ name: "Carlos" });

    const product1 = inventoryManager.createProduct({
      name: "Teclado Mecânico",
      price: 300,
      quantity: 5,
    });
    const product2 = inventoryManager.createProduct({
      name: "Monitor 4K",
      price: 1200,
      quantity: 3,
    });
    const product3 = inventoryManager.createProduct({
      name: "Webcam HD",
      price: 250,
      quantity: 8,
    });

    userManager.setUserProducts(user1.id, [product1, product2]);
    userManager.setUserProducts(user2.id, [product2, product3]);
    userManager.setUserProducts(user3.id, [product1, product3]);

    expect(userManager.getUserById(user1.id).products).toHaveLength(2);
    expect(userManager.getUserById(user2.id).products).toHaveLength(2);
    expect(userManager.getUserById(user3.id).products).toHaveLength(2);

    inventoryManager.deleteProduct(product2.id);

    expect(inventoryManager.getProducts()).toHaveLength(2);
    expect(() => inventoryManager.findProductById(product2.id)).toThrow();

    const user1Products = userManager.getUserById(user1.id).products;
    const user2Products = userManager.getUserById(user2.id).products;

    expect(user1Products.some((p) => p.id === product2.id)).toBe(true);
    expect(user2Products.some((p) => p.id === product2.id)).toBe(true);
  });

  it("deve refletir alterações de quantidade do inventário nos produtos dos usuários por referência compartilhada", () => {
    const user1 = userManager.createUser({ name: "Estoquista A" });
    const user2 = userManager.createUser({ name: "Estoquista B" });

    const INITIAL_QUANTITY = 10;
    const ADDITIONAL_QUANTITY = 15;
    const REMOVED_QUANTITY = 5;

    const laptop = inventoryManager.createProduct({
      name: "Laptop Dell",
      price: 3500,
      quantity: INITIAL_QUANTITY,
    });

    userManager.setUserProducts(user1.id, [laptop]);
    userManager.setUserProducts(user2.id, [laptop]);

    inventoryManager.addProductQuantity(laptop.id, ADDITIONAL_QUANTITY);

    const productFromUser1 = userManager.getUserById(user1.id).products[0];
    const productFromUser2 = userManager.getUserById(user2.id).products[0];
    const productFromInventory = inventoryManager.findProductById(laptop.id);

    const addedValue = INITIAL_QUANTITY + ADDITIONAL_QUANTITY;
    expect(productFromUser1).toBe(productFromInventory);
    expect(productFromUser2).toBe(productFromInventory);
    expect(productFromUser1.quantity).toBe(addedValue);
    expect(productFromUser2.quantity).toBe(addedValue);

    inventoryManager.removeProductQuantity(laptop.id, REMOVED_QUANTITY);

    const removedValue = addedValue - REMOVED_QUANTITY;
    expect(productFromUser1.quantity).toBe(removedValue);
    expect(productFromUser2.quantity).toBe(removedValue);
    expect(productFromInventory.quantity).toBe(removedValue);
  });

  it("deve filtrar usuários e produtos por nome e atribuir produtos filtrados aos usuários", () => {
    const user1 = userManager.createUser({ name: "João Silva" });
    const user2 = userManager.createUser({ name: "Maria Silva" });
    userManager.createUser({ name: "Pedro Santos" });

    inventoryManager.createProduct({
      name: "Cadeira Gamer",
      price: 800,
      quantity: 12,
    });
    inventoryManager.createProduct({
      name: "Cadeira Escritório",
      price: 450,
      quantity: 20,
    });
    inventoryManager.createProduct({
      name: "Mesa Gamer",
      price: 600,
      quantity: 8,
    });

    const usersWithSilva = userManager.getUsers({ name: "Silva" });
    expect(usersWithSilva).toHaveLength(2);

    const chairProducts = inventoryManager.searchProducts({ name: "Cadeira" });
    expect(chairProducts).toHaveLength(2);

    userManager.setUserProducts(user1.id, chairProducts);
    userManager.setUserProducts(user2.id, chairProducts);

    expect(userManager.getUserById(user1.id).products).toHaveLength(2);
    expect(userManager.getUserById(user2.id).products).toHaveLength(2);
    expect(userManager.getUserById(user1.id).products[0].name).toContain("Cadeira");
    expect(userManager.getUserById(user2.id).products[1].name).toContain("Cadeira");
  });

  it("deve falhar ao atribuir produtos a usuário inexistente mas manter integridade do inventário", () => {
    const validUser = userManager.createUser({ name: "Usuário Válido" });
    
    const product1 = inventoryManager.createProduct({
      name: "Produto A",
      price: 50,
      quantity: 3,
    });
    const product2 = inventoryManager.createProduct({
      name: "Produto B",
      price: 100,
      quantity: 5,
    });

    const FAKE_USER_ID = "invalid-user-id";
    const resultInvalid = userManager.setUserProducts(FAKE_USER_ID, [product1, product2]);
    const resultValid = userManager.setUserProducts(validUser.id, [product1, product2]);

    expect(resultInvalid).toBe(false);
    expect(resultValid).toBe(true);
    expect(inventoryManager.getProducts()).toHaveLength(2);
    expect(userManager.getUserById(validUser.id).products).toHaveLength(2);
    expect(() => userManager.getUserById(FAKE_USER_ID)).toThrow();
  });
});
