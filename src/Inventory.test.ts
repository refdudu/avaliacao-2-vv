import { InventoryManager } from "./InventoryManager";
import { ProductDTO } from "./Product";

describe("Gerenciamento de inventário", () => {
  let inventoryManager: InventoryManager;
  beforeEach(() => {
    inventoryManager = new InventoryManager();
  });

  it("cria um produto no inventário", () => {
    const quantity = 10;
    const price = 100;
    const product: ProductDTO = {
      name: "Produto A",
      price,
      quantity
    };
    inventoryManager.createProduct(product);
    const items = inventoryManager.getProducts();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveProperty("id");
    expect(items[0].quantity).toBe(quantity);
    expect(items[0].price).toBe(price);
  });
});
