import { Product, ProductDTO } from "./Product";

export class InventoryManager {
  private products: Product[] = [];

  createProduct(productDTO: ProductDTO): Product {
    const newProduct = new Product(productDTO);
    this.products.push(newProduct);
    return newProduct;
  }

  getProducts(): Product[] {
    return this.products;
  }
}