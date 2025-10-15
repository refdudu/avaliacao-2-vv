import { Product, ProductDTO } from "./Product";
import { ProductNotFoundError } from "./ProductNotFoundError";

export class InventoryManager {
  private products: Map<string, Product> = new Map();

  createProduct(productDTO: ProductDTO): Product {
    const newProduct = new Product(productDTO);
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  findProductById(id: string): Product {
    const product = this.products.get(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  }

  addProductQuantity(id: string, quantityToAdd: number): void {
    if (quantityToAdd <= 0) {
      throw new Error("A quantidade a ser adicionada deve ser um número positivo.");
    }
    const product = this.findProductById(id);
    product.addQuantity(quantityToAdd);
  }

  getProducts(): Product[] {
    return Array.from(this.products.values());
  }
}