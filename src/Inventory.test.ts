import { InventoryManager } from "./InventoryManager";
import { Product, ProductDTO } from "./Product";
import { ProductNotFoundError } from "./ProductNotFoundError";

describe("Gerenciamento de inventário", () => {
  let inventoryManager: InventoryManager;

  beforeEach(() => {
    inventoryManager = new InventoryManager();
  });

  it("deve criar um produto no inventário", () => {
    const productDTO: ProductDTO = {
      name: "Produto A",
      price: 100,
      quantity: 10
    };
    inventoryManager.createProduct(productDTO);
    const items = inventoryManager.getProducts();
    
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveProperty("id");
    expect(items[0].quantity).toBe(productDTO.quantity);
    expect(items[0].price).toBe(productDTO.price);
  });

  it("deve adicionar quantidade a um produto existente", () => {
    const productDTO: ProductDTO = { name: "Produto A", price: 100, quantity: 10 };
    const createdProduct = inventoryManager.createProduct(productDTO);
    const quantityToAdd = 5;
    
    inventoryManager.addProductQuantity(createdProduct.id, quantityToAdd);
    const product = inventoryManager.findProductById(createdProduct.id);
    
    // O teste agora verifica o resultado da soma
    expect(product.quantity).toBe(productDTO.quantity + quantityToAdd);
  });

  it("deve lançar um erro ao tentar encontrar um produto com ID inexistente", () => {
    const invalidId = "id-invalido-123";

    // Verifica se a função lança a classe de erro específica
    expect(() => inventoryManager.findProductById(invalidId)).toThrow(
      ProductNotFoundError
    );
  });

  it("deve lançar um erro ao tentar adicionar uma quantidade não positiva", () => {
    const productDTO: ProductDTO = { name: "Produto B", price: 50, quantity: 10 };
    const createdProduct = inventoryManager.createProduct(productDTO);

    // Testa com quantidade zero
    expect(() => inventoryManager.addProductQuantity(createdProduct.id, 0)).toThrow(
      "A quantidade a ser adicionada deve ser um número positivo."
    );
    // Testa com quantidade negativa
    expect(() => inventoryManager.addProductQuantity(createdProduct.id, -5)).toThrow(
      "A quantidade a ser adicionada deve ser um número positivo."
    );
  });
});