export class ProductNotFoundError extends Error {
  constructor() {
    super("Produto não encontrado");
    this.name = "ProductNotFoundError";
    Object.setPrototypeOf(this, ProductNotFoundError.prototype);
  }
}