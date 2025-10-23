import express, { NextFunction, Request, Response } from "express";
import { UserManager } from "./UserManager";
import { User, UserDTO } from "./User";
import cors from "cors";
import { Product, ProductDTO } from "./Product";
import { InventoryManager } from "./InventoryManager";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const userManager = new UserManager();

const userRouter = express.Router();
userRouter.get("/", (req, res) => {
  const { name } = req.query;
  const userName = Array.isArray(name) ? name[0] : name;
  console.log("🚀 ~ userName:", userName);

  const users = userManager.getUsers({ name: userName?.toString() });
  console.log("🚀 ~ users:", users);
  res.status(200).json(users);
});
userRouter.post("/", (req, res) => {
  const { name } = req.body;
  const user: UserDTO = { name };

  const newUser = userManager.createUser(user);
  res.status(201).json(newUser);
});
userRouter.delete("/:userId", (req, res) => {
  const { userId } = req.params;
  userManager.deleteUser(userId);
  res.status(200).json({ message: "User deleted successfully" });
});

const userProductRouter = express.Router();
export interface CustomRequestProps {
  user: User;
  inventoryManager: InventoryManager;
}
export interface CustomRequest<T> extends Request<T>, CustomRequestProps {}
const userProductMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const user = userManager.getUserById(userId);
    const inventoryManager = new InventoryManager(user.products);

    (req as CustomRequest<{}>).user = user;
    (req as CustomRequest<{}>).inventoryManager = inventoryManager;
    next();
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
};
app.use("/api/users", userRouter);

userProductRouter.use(userProductMiddleware);
userProductRouter.post("/", (req, res) => {
  const _req = req as CustomRequest<{}>;

  const productDTO = req.body;
  const { inventoryManager } = _req;
  inventoryManager.createProduct(productDTO);
  const products = inventoryManager.getProducts();

  userManager.setUserProducts(_req.user.id, products);
  res.status(201).json(products);
});
userProductRouter.patch("/:productId/add", (req, res) => {
  const _req = req as CustomRequest<{ productId: string }>;
  const { productId } = req.params;

  const { inventoryManager } = _req;
  inventoryManager.addProductQuantity(productId, 1);
  const products = inventoryManager.getProducts();

  userManager.setUserProducts(_req.user.id, products);
  res.status(200).json(products);
});
userProductRouter.patch("/:productId/remove", (req, res) => {
  const _req = req as CustomRequest<{ productId: string }>;
  const { productId } = req.params;

  const { inventoryManager } = _req;
  inventoryManager.removeProductQuantity(productId, 1);
  const products = inventoryManager.getProducts();

  userManager.setUserProducts(_req.user.id, products);
  res.status(200).json(products);
});
userProductRouter.delete("/:productId", (req, res) => {
  const _req = req as CustomRequest<{ productId: string }>;

  const { productId } = req.params;
  const { inventoryManager } = _req;
  inventoryManager.deleteProduct(productId);
  const products = inventoryManager.getProducts();

  userManager.setUserProducts(_req.user.id, products);
  res.status(200).json(products);
});

app.use("/api/users/:userId/products", userProductRouter);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
