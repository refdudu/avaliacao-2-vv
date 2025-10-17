import { InsufficientStockError } from "./errors/InsufficientStockError";
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
  it("remover quantidade de produto existente", () => {
    const productDTO: ProductDTO = {
      name: "Produto A",
      price: 100,
      quantity: 10,
    };
    const createdProduct = inventoryManager.createProduct(productDTO);
    const quantityToRemove = 5;
    inventoryManager.removeProductQuantity(createdProduct.id, quantityToRemove);
    const product = inventoryManager.findProductById(createdProduct.id);
    expect(product?.quantity).toBe(productDTO.quantity - quantityToRemove);
  });
  it("remover quantidade maior que a disponível lança erro", () => {
    const productDTO: ProductDTO = {
      name: "Produto A",
      price: 100,
      quantity: 10,
    };
    const createdProduct = inventoryManager.createProduct(productDTO);
    const quantityToRemove = 15;
    expect(() =>
      inventoryManager.removeProductQuantity(
        createdProduct.id,
        quantityToRemove
      )
    ).toThrow(InsufficientStockError);
  });
  
  it("buscar produto pelo nome", () => {
    const noProducts = inventoryManager.searchProducts({ name: "" });
    expect(noProducts).toHaveLength(0);

    const productA: ProductDTO = {
      name: "Mouse",
      price: 100,
      quantity: 10,
    };
    inventoryManager.createProduct(productA);

    const productB: ProductDTO = {
      name: "Teclado",
      price: 200,
      quantity: 5,
    };
    inventoryManager.createProduct(productB);

    const foundProducts = inventoryManager.searchProducts({ name: "Mou" });
    expect(foundProducts).toHaveLength(1);
    expect(foundProducts[0].name).toBe("Mouse");

    const foundProductsCaseInsensitive = inventoryManager.searchProducts({
      name: "teC",
    });
    expect(foundProductsCaseInsensitive).toHaveLength(1);
    expect(foundProductsCaseInsensitive[0].name).toBe("Teclado");

    const notFoundProducts = inventoryManager.searchProducts({
      name: "Monitor",
    });
    expect(notFoundProducts).toHaveLength(0);
  });
});
