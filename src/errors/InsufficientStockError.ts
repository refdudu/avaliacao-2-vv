export class InsufficientStockError extends Error {
  constructor() {
    super("Quantidade insuficiente em estoque");
    this.name = "InsufficientStockError";
  }
}