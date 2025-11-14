import express from "express";
import { UserManager } from "./src/UserManager";
import { InventoryManager } from "./src/InventoryManager";
import { UserDTO } from "./src/User";
import { ProductDTO, Product } from "./src/Product";

const app = express();
const port = 3001;

app.use(express.json());

// Instâncias globais
const userManager = new UserManager();

// Rotas para usuários
app.get("/users", (req, res) => {
  const { name } = req.query;
  const users = userManager.getUsers({ name: name as string });
  res.json(users);
});

app.post("/users", (req, res) => {
  const { name }: UserDTO = req.body;
  if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
  const user = userManager.createUser({ name });
  res
    .status(201)
    .json({ id: user.id, name: user.name, products: user.products });
});

app.get("/users/:id", (req, res) => {
  try {
    const user = userManager.getUserById(req.params.id);
    res.json({ id: user.id, name: user.name, products: user.products });
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

app.delete("/users/:id", (req, res) => {
  const success = userManager.deleteUser(req.params.id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// Rotas para produtos de um usuário
app.get("/users/:id/products", (req, res) => {
  try {
    const user = userManager.getUserById(req.params.id);
    res.json(user.products);
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

app.post("/users/:userId/products", (req, res) => {
  const { name, price, quantity }: ProductDTO = req.body;
  const { userId } = req.params;
  if (!name || price === null || quantity === null) {
    return res
      .status(400)
      .json({ error: "Nome, preço e quantidade são obrigatórios" });
  }
  try {
    const user = userManager.getUserById(userId);
    const inventoryManager = new InventoryManager(user.products);
    const product = inventoryManager.createProduct({ name, price, quantity });
    const updatedProducts = inventoryManager.getProducts();

    userManager.setUserProducts(userId, updatedProducts);
    res.status(201).json(product);
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

app.put("/users/:userId/products/:productId/add", (req, res) => {
  try {
    const user = userManager.getUserById(req.params.userId);

    const product = user.products.find((p) => p.id === req.params.productId);
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado" });

    res.json({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  } catch (error) {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

app.delete("/users/:userId/products/:productId", (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = userManager.getUserById(userId);
    const inventoryManager = new InventoryManager(user.products);
    inventoryManager.deleteProduct(productId);

    const updatedProducts = inventoryManager.getProducts();
    userManager.setUserProducts(userId, updatedProducts);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Usuário ou produto não encontrado" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
