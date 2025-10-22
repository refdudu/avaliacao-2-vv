# Sistema de Gerenciamento - Web + API

Sistema completo de gerenciamento de usuários e produtos com API REST e interface web.

## 🚀 Tecnologias

### Backend (API REST)
- **Node.js** + **TypeScript**
- **Express** - Framework web
- **CORS** - Habilita requisições do frontend

### Frontend
- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização

## 📋 Funcionalidades

### Usuários
- ✅ Listar todos os usuários
- ✅ Buscar usuário por nome
- ✅ Criar novo usuário
- ✅ Deletar usuário
- ✅ Ver detalhes do usuário com seus produtos
- ✅ Definir produtos de um usuário

### Produtos
- ✅ Listar todos os produtos
- ✅ Buscar produto por nome
- ✅ Criar novo produto
- ✅ Deletar produto
- ✅ Adicionar quantidade ao estoque
- ✅ Remover quantidade do estoque

## 🛠️ Como Executar

### 1. Instalar Dependências

```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd web
npm install
cd ..
```

### 2. Iniciar o Backend (API)

Em um terminal, execute:

```bash
npm run dev
```

A API estará rodando em: **http://localhost:3001**

### 3. Iniciar o Frontend

Em outro terminal, execute:

```bash
cd web
npm run dev
```

O frontend estará disponível em: **http://localhost:5173** (ou outra porta que o Vite indicar)

## 📡 Endpoints da API

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Lista todos os usuários |
| GET | `/api/users?name=termo` | Busca usuários por nome |
| GET | `/api/users/:id` | Obtém usuário por ID |
| POST | `/api/users` | Cria novo usuário |
| DELETE | `/api/users/:id` | Deleta usuário |
| PUT | `/api/users/:id/products` | Define produtos do usuário |

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Lista todos os produtos |
| GET | `/api/products?name=termo` | Busca produtos por nome |
| GET | `/api/products/:id` | Obtém produto por ID |
| POST | `/api/products` | Cria novo produto |
| DELETE | `/api/products/:id` | Deleta produto |
| PUT | `/api/products/:id/add` | Adiciona quantidade |
| PUT | `/api/products/:id/remove` | Remove quantidade |

## 📝 Exemplos de Uso da API

### Criar Usuário
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva"}'
```

### Criar Produto
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":50.00,"quantity":10}'
```

### Buscar Usuários
```bash
curl http://localhost:3001/api/users?name=João
```

## 🧪 Testes

Para rodar os testes unitários:

```bash
npm test
```

## 📁 Estrutura do Projeto

```
avaliacao-2-vv/
├── src/                          # Backend
│   ├── server.ts                 # Servidor Express
│   ├── User.ts                   # Modelo de Usuário
│   ├── Product.ts                # Modelo de Produto
│   ├── UserManager.ts            # Gerenciador de Usuários
│   ├── InventoryManager.ts       # Gerenciador de Inventário
│   └── errors/                   # Classes de erro
│
├── web/                          # Frontend
│   ├── src/
│   │   ├── App.tsx              # Componente principal
│   │   ├── api.ts               # Cliente da API
│   │   ├── types.ts             # Tipos TypeScript
│   │   └── components/
│   │       ├── UserList.tsx     # Lista de usuários
│   │       ├── UserDetail.tsx   # Detalhes do usuário
│   │       └── ProductList.tsx  # Lista de produtos
│   └── tailwind.config.js       # Config do Tailwind
│
└── package.json
```

## 🎨 Interface Web

A interface possui 3 telas principais:

1. **Lista de Usuários** - Exibe todos os usuários com busca e opção de criar/deletar
2. **Detalhes do Usuário** - Mostra informações do usuário e seus produtos
3. **Lista de Produtos** - Exibe todos os produtos com busca e opção de criar/deletar

## 💡 Observações

- O backend roda na porta **3001**
- O frontend roda na porta **5173** (padrão do Vite)
- Os dados são armazenados em memória (não persistem após reiniciar o servidor)
- CORS está habilitado para permitir requisições do frontend

## 🤝 Desenvolvimento

Para desenvolvimento, recomenda-se:
1. Manter 2 terminais abertos (um para backend, outro para frontend)
2. O backend tem hot reload com `tsx watch`
3. O frontend tem HMR (Hot Module Replacement) do Vite
