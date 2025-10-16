import { ProductNotFoundError } from "./errors/ProductNotFoundError";
import { Product, ProductDTO } from "./Product";

export class InventoryManager {
  constructor(private products: Product[] = []) {}
  findProductById(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new ProductNotFoundError();
    return product;
  }
  addProductQuantity(id: string, quantityToAdd: number): void {
    const product = this.findProductById(id);
    product.addQuantity(quantityToAdd);
  }
  removeProductQuantity(id: string, quantityToRemove: number): void {
    const product = this.findProductById(id);
    product.removeQuantity(quantityToRemove); 
  }
  createProduct(productDTO: ProductDTO): Product {
    const newProduct = new Product(productDTO);
    this.products.push(newProduct);
    return newProduct;
  }
  getProducts(): Product[] {
    return [...this.products];
  }
  deleteProduct(productId: string): void {
    if (this.productExists(productId))
      this.products = this.products.filter((p) => p.id !== productId);
  }
  private productExists(productId: string): boolean {
    return this.products.some((p) => p.id === productId);
  }
}
