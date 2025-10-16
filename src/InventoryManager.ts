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
  createProduct(productDTO: ProductDTO): Product {
    const newProduct = new Product(productDTO);
    this.products.push(newProduct);
    return newProduct;
  }
  getProducts(): Product[] {
    return [...this.products];
  }
  deleteProduct(id: string): void {
    const product = this.findProductById(id);
    this.products = this.products.filter((p) => p.id !== product.id);
  }
}