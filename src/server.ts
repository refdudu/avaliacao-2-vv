import express, { Request, Response } from 'express';
import cors from 'cors';
import { UserManager } from './UserManager';
import { InventoryManager } from './InventoryManager';
import { UserDTO } from './User';
import { ProductDTO } from './Product';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Instâncias dos gerenciadores
const userManager = new UserManager();
const inventoryManager = new InventoryManager();

// ============= ROTAS DE USUÁRIOS =============

// GET /api/users - Listar usuários (com filtro opcional)
app.get('/api/users', (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const users = userManager.getUsers({ name: name as string });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// GET /api/users/:id - Obter usuário por ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  try {
    const user = userManager.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

// POST /api/users - Criar usuário
app.post('/api/users', (req: Request, res: Response) => {
  try {
    const userDTO: UserDTO = req.body;
    const newUser = userManager.createUser(userDTO);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
});

// DELETE /api/users/:id - Deletar usuário
app.delete('/api/users/:id', (req: Request, res: Response) => {
  try {
    const result = userManager.deleteUser(req.params.id);
    if (result) {
      res.json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// PUT /api/users/:id/products - Definir produtos do usuário
app.put('/api/users/:id/products', (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    const products = productIds.map((id: string) => 
      inventoryManager.findProductById(id)
    );
    const result = userManager.setUserProducts(req.params.id, products);
    if (result) {
      res.json({ message: 'Produtos definidos com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao definir produtos' });
  }
});

// ============= ROTAS DE PRODUTOS =============

// GET /api/products - Listar produtos (com busca opcional)
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (name) {
      const products = inventoryManager.searchProducts({ name: name as string });
      res.json(products);
    } else {
      const products = inventoryManager.getProducts();
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET /api/products/:id - Obter produto por ID
app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = inventoryManager.findProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Produto não encontrado' });
  }
});

// POST /api/products - Criar produto
app.post('/api/products', (req: Request, res: Response) => {
  try {
    const productDTO: ProductDTO = req.body;
    const newProduct = inventoryManager.createProduct(productDTO);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar produto' });
  }
});

// DELETE /api/products/:id - Deletar produto
app.delete('/api/products/:id', (req: Request, res: Response) => {
  try {
    inventoryManager.deleteProduct(req.params.id);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(404).json({ error: 'Produto não encontrado' });
  }
});

// PUT /api/products/:id/add - Adicionar quantidade
app.put('/api/products/:id/add', (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    inventoryManager.addProductQuantity(req.params.id, quantity);
    const product = inventoryManager.findProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Produto não encontrado' });
  }
});

// PUT /api/products/:id/remove - Remover quantidade
app.put('/api/products/:id/remove', (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    inventoryManager.removeProductQuantity(req.params.id, quantity);
    const product = inventoryManager.findProductById(req.params.id);
    res.json(product);
  } catch (error: any) {
    if (error.message?.includes('estoque insuficiente')) {
      res.status(400).json({ error: 'Estoque insuficiente' });
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
