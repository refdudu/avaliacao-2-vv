import { randomUUID } from "node:crypto";
import { Product, ProductDTO } from "./Product";

export class InventoryManager {
  private products: Product[] = [];

  createProduct(product: ProductDTO) {
    const _product: Product = { ...product, id: randomUUID() };
    this.products.push(_product);
  }

  getProducts() {
    return this.products;
  }
}
