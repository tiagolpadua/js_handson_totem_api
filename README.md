# Totem API

API Backend para o sistema Totem - JSE02 Javascript Expert Hands-on

## 🚀 Tecnologias

- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- SQLite
- Swagger/OpenAPI
- Jest
- ESLint & Prettier

## 📋 Pré-requisitos

- Node.js >= 20.0.0
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

## 🎲 Banco de Dados

```bash
# Popular banco de dados com dados iniciais
npm run seed
```

## ▶️ Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## � Documentação da API

A documentação interativa da API está disponível via Swagger UI:

- **URL**: `http://localhost:3001/api-docs`
- Documentação completa de todos os endpoints
- Possibilidade de testar as requisições diretamente no navegador
- Schemas OpenAPI 3.0 com exemplos

## �📚 API Endpoints

### Health Check
- **GET** `/health` - Verificar status da API

### Produtos

- **GET** `/products` - Listar todos os produtos
  - Query params:
    - `category`: Filtrar por categoria
    - `inStock`: `true` para produtos com estoque
    - `search`: Buscar por nome ou SKU

- **GET** `/products/:id` - Buscar produto por ID

- **GET** `/products/sku/:sku` - Buscar produto por SKU

- **POST** `/products` - Criar novo produto
  ```json
  {
    "sku": "BEB-0011",
    "name": "Produto Teste",
    "price": 10.50,
    "stock": 100,
    "category": "teste"
  }
  ```

- **PUT** `/products/:id` - Atualizar produto
  ```json
  {
    "name": "Produto Atualizado",
    "price": 12.50,
    "stock": 80
  }
  ```

- **DELETE** `/products/:id` - Deletar produto

## 🏗️ Estrutura do Projeto

```
src/
├── config/           # Configurações (database, etc)
├── controllers/      # Controllers da aplicação
├── middleware/       # Middlewares personalizados
├── models/          # Models do Sequelize
├── routes/          # Definição de rotas
├── types/           # TypeScript types e interfaces
├── index.ts         # Entry point da aplicação
└── seed.ts          # Script para popular banco de dados
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar coverage
npm run test:coverage
```

## 📝 Licença

ISC
