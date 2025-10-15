import { ProductNotFoundError } from "./errors/ProductNotFoundError";
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
      quantity,
    };
    inventoryManager.createProduct(product);
    const items = inventoryManager.getProducts();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveProperty("id");
    expect(items[0].quantity).toBe(quantity);
    expect(items[0].price).toBe(price);
  });

  it("adiciona quantidade a um produto existente", () => {
    const productDTO: ProductDTO = {
      name: "Produto A",
      price: 100,
      quantity: 10,
    };
    const createdProduct = inventoryManager.createProduct(productDTO);
    const quantityToAdd = 5;
    inventoryManager.addProductQuantity(createdProduct.id, quantityToAdd);
    const product = inventoryManager.findProductById(createdProduct.id);
    expect(product?.quantity).toBe(productDTO.quantity + quantityToAdd);
  });
  it("deleta produto do inventário", () => {
    const productDTO: ProductDTO = {
      name: "Produto A",
      price: 100,
      quantity: 10,
    };
    const createdProduct = inventoryManager.createProduct(productDTO);
    const searchedProduct = inventoryManager.findProductById(createdProduct.id);

    expect(searchedProduct).toBeDefined();
    inventoryManager.deleteProduct(searchedProduct.id);

    expect(() => inventoryManager.findProductById(searchedProduct.id)).toThrow(
      ProductNotFoundError
    );
  });
});
