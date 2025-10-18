import { InventoryManager } from "@/InventoryManager";
import { Product } from "@/Product";
import { UserManager } from "@/UserManager";
import { InsufficientStockError } from "@/errors/InsufficientStockError";

describe("Integração - Cenário de Compra", () => {
  let userManager: UserManager;
  let inventoryManager: InventoryManager;
  let userId: string;
  let product: Product;

  beforeEach(() => {
    userManager = new UserManager();
    inventoryManager = new InventoryManager();

    const user = userManager.createUser({ name: "Comprador" });
    userId = user.id;

    product = inventoryManager.createProduct({
      name: "Teclado Mecânico",
      price: 350,
      quantity: 5, 
    });
  });

  it("deve permitir que um usuário compre um produto e atualizar o estoque", () => {
    userManager.setUserProducts(userId, [product]);
    inventoryManager.removeProductQuantity(product.id, 1);

    const user = userManager.getUserById(userId);
    expect(user.products).toHaveLength(1);
    expect(user.products[0].name).toBe("Teclado Mecânico");


    const updatedProduct = inventoryManager.findProductById(product.id);
    expect(updatedProduct.quantity).toBe(4); 
  });

  it("deve lançar um erro ao tentar comprar um produto com estoque insuficiente", () => {
    const quantityToBuy = 10; 

    expect(() => {
      inventoryManager.removeProductQuantity(product.id, quantityToBuy);
    }).toThrow(InsufficientStockError);

    const currentProductState = inventoryManager.findProductById(product.id);
    expect(currentProductState.quantity).toBe(5); 
  });
});