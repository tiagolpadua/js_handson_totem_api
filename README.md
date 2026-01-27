# Totem API

API Backend para o sistema Totem - JSE02 Javascript Expert Hands-on

---

## 📖 Sumário

1. [Visão Geral](#-visão-geral)
2. [Arquitetura da Aplicação](#-arquitetura-da-aplicação)
3. [Tecnologias e Bibliotecas](#-tecnologias-e-bibliotecas)
4. [Estrutura do Projeto](#️-estrutura-do-projeto)
5. [Fluxo de Requisição](#-fluxo-de-requisição)
6. [Padrões e Design Patterns](#-padrões-e-design-patterns)
7. [Instalação e Configuração](#-instalação-e-configuração)
8. [Documentação da API](#-documentação-da-api)
9. [API Endpoints](#-api-endpoints)
10. [Testes](#-testes)

---

## 🎯 Visão Geral

### O que é este projeto?

A **Totem API** é uma API RESTful construída para gerenciar produtos de um sistema de totem de autoatendimento. Este projeto foi desenvolvido com fins educacionais para demonstrar boas práticas de desenvolvimento backend com Node.js e TypeScript.

### Principais características:

- ✅ **API RESTful** completa com operações CRUD
- ✅ **Validação de dados** robusta
- ✅ **Tratamento de erros** centralizado
- ✅ **Documentação interativa** com Swagger
- ✅ **Testes automatizados** com Jest
- ✅ **Type Safety** com TypeScript
- ✅ **Linting e formatação** automatizados
- ✅ **Logs estruturados** para monitoramento

### Contexto de uso:

Este sistema serve como backend para totens de autoatendimento (como os encontrados em fast-foods), permitindo:

- Listagem de produtos disponíveis
- Filtragem por categorias
- Busca por nome ou código SKU
- Gerenciamento de estoque
- Validação de disponibilidade

---

## 🏛️ Arquitetura da Aplicação

### Arquitetura em Camadas (Layered Architecture)

O projeto segue o padrão de **arquitetura em camadas**, onde cada camada tem uma responsabilidade específica:

```txt
┌─────────────────────────────────────────────────┐
│           CLIENT (Frontend/Apps)                │
└─────────────────┬───────────────────────────────┘
                  │ HTTP Requests
                  ▼
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Routes (Express Router)                 │  │
│  │  - Definição de endpoints                │  │
│  │  - Validação de schemas (Zod)            │  │
│  └──────────────────┬───────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              CONTROLLER LAYER                    │
│  ┌──────────────────────────────────────────┐  │
│  │  Controllers                             │  │
│  │  - Recebe requisições HTTP               │  │
│  │  - Delega lógica para Services           │  │
│  │  - Retorna respostas HTTP                │  │
│  └──────────────────┬───────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│               SERVICE LAYER                      │
│  ┌──────────────────────────────────────────┐  │
│  │  Services (Business Logic)               │  │
│  │  - Regras de negócio                     │  │
│  │  - Validações complexas                  │  │
│  │  - Orquestração de Models                │  │
│  └──────────────────┬───────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│                MODEL LAYER                       │
│  ┌──────────────────────────────────────────┐  │
│  │  Models (Sequelize ORM)                  │  │
│  │  - Definição de entidades                │  │
│  │  - Mapeamento objeto-relacional          │  │
│  │  - Validações de schema                  │  │
│  └──────────────────┬───────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              DATA LAYER                          │
│  ┌──────────────────────────────────────────┐  │
│  │  Database (SQLite)                       │  │
│  │  - Armazenamento persistente             │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Componentes Transversais (Cross-cutting Concerns)

```
┌─────────────────────────────────────────────────┐
│            MIDDLEWARES                           │
│  ┌──────────────────────────────────────────┐  │
│  │  • CORS - Controle de acesso             │  │
│  │  • Body Parser - Parse de JSON/URL       │  │
│  │  │  Encoded                               │  │
│  │  • Error Handler - Tratamento de erros   │  │
│  │  • Not Found Handler - Rotas não         │  │
│  │  │  encontradas                           │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              UTILITIES                           │
│  ┌──────────────────────────────────────────┐  │
│  │  • Logger (Winston) - Logs estruturados  │  │
│  │  • Custom Errors - Erros personalizados  │  │
│  │  • Types - Definições TypeScript         │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Tecnologias e Bibliotecas

### Core

#### **Node.js (>= 20.0.0)**

- **O que é**: Runtime JavaScript baseado no V8 do Chrome
- **Por que usamos**: Permite executar JavaScript no servidor
- **Como usamos**: Base da aplicação, executa todo o código TypeScript compilado

#### **TypeScript**

- **O que é**: Superset do JavaScript que adiciona tipagem estática
- **Por que usamos**:
  - Detecta erros em tempo de desenvolvimento
  - Melhora a manutenibilidade do código
  - Fornece autocompletar inteligente
  - Documenta contratos de dados
- **Como usamos**: Todo o código fonte é escrito em TypeScript e compilado para JavaScript

### Framework Web

#### **Express.js**

- **O que é**: Framework web minimalista e flexível para Node.js
- **Por que usamos**:
  - Amplamente adotado e maduro
  - Grande ecossistema de middlewares
  - Fácil de aprender e usar
- **Como usamos**:

  ```typescript
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/', routes);
  ```

### Banco de Dados

#### **Sequelize ORM**

- **O que é**: ORM (Object-Relational Mapping) para Node.js
- **Por que usamos**:
  - Abstrai queries SQL em métodos JavaScript
  - Previne SQL injection
  - Gerencia migrations e schemas
  - Suporte a múltiplos bancos de dados
- **Como usamos**:

  ```typescript
  class Product extends Model<IProduct> {
    declare id: number;
    declare sku: string;
    declare name: string;
  }
  ```

#### **SQLite**

- **O que é**: Banco de dados relacional serverless, embutido
- **Por que usamos**:
  - Perfeito para desenvolvimento e demos
  - Zero configuração
  - Arquivo único, fácil de compartilhar
- **Observação**: Em produção, recomenda-se PostgreSQL ou MySQL

### Validação

#### **Zod**

- **O que é**: Biblioteca de validação e parsing de schemas TypeScript-first
- **Por que usamos**:
  - Type-safe: Gera tipos TypeScript automaticamente
  - Validação declarativa
  - Mensagens de erro claras
- **Como usamos**:

  ```typescript
  const productSchema = z.object({
    sku: z.string().min(3),
    name: z.string().min(3),
    price: z.number().positive(),
  });
  ```

### Documentação

#### **Swagger/OpenAPI**

- **O que é**: Especificação para documentar APIs REST
- **Bibliotecas usadas**:
  - `swagger-jsdoc`: Gera especificação OpenAPI a partir de comentários JSDoc
  - `swagger-ui-express`: Interface web interativa para testar a API
- **Por que usamos**:
  - Documentação sempre atualizada
  - Interface interativa para testes
  - Facilita integração com frontend
- **Como usamos**:

  ```typescript
  /**
   * @swagger
   * /products:
   *   get:
   *     summary: List all products
   */
  ```

### Logging

#### **Winston**

- **O que é**: Biblioteca de logging para Node.js
- **Por que usamos**:
  - Logs estruturados (JSON)
  - Múltiplos níveis de log (error, warn, info, debug)
  - Suporte a múltiplos transportes (console, arquivo, etc.)
- **Como usamos**:

  ```typescript
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
  });
  ```

### Segurança e Utilitários

#### **CORS**

- **O que é**: Middleware para habilitar Cross-Origin Resource Sharing
- **Por que usamos**: Permite que o frontend (em outra origem) acesse a API
- **Como usamos**: `app.use(cors());`

#### **dotenv**

- **O que é**: Carrega variáveis de ambiente de arquivo `.env`
- **Por que usamos**: Separar configurações do código
- **Como usamos**: `dotenv.config();`

### Desenvolvimento e Testes

#### **Jest**

- **O que é**: Framework de testes JavaScript
- **Por que usamos**: Testes unitários e de integração
- **Como usamos**: Testes para services, controllers e rotas

#### **Supertest**

- **O que é**: Biblioteca para testar APIs HTTP
- **Por que usamos**: Testa endpoints da API de forma integrada

#### **TSX**

- **O que é**: Executor de TypeScript ultra-rápido
- **Por que usamos**: Executa código TypeScript diretamente em desenvolvimento
- **Como usamos**: `tsx watch src/index.ts`

#### **ESLint + Prettier**

- **O que é**: Ferramentas de linting e formatação
- **Por que usamos**:
  - ESLint: Detecta problemas no código
  - Prettier: Formata código automaticamente
- **Como usamos**: Pre-commit hooks e scripts npm

---

## 🗂️ Estrutura do Projeto

```txt
totem-api/
│
├── src/                          # Código fonte
│   ├── index.ts                  # Entry point - inicia servidor
│   ├── seed.ts                   # Script para popular BD
│   │
│   ├── config/                   # Configurações
│   │   ├── database.ts           # Conexão Sequelize
│   │   └── swagger.ts            # Configuração Swagger
│   │
│   ├── routes/                   # Definição de rotas
│   │   ├── index.ts              # Router principal
│   │   └── products.routes.ts    # Rotas de produtos
│   │
│   ├── controllers/              # Controllers (camada HTTP)
│   │   └── ProductController.ts  # Lógica de requisições HTTP
│   │
│   ├── services/                 # Services (camada de negócio)
│   │   └── ProductService.ts     # Regras de negócio
│   │
│   ├── models/                   # Models (camada de dados)
│   │   └── Product.ts            # Model Sequelize
│   │
│   ├── middleware/               # Middlewares personalizados
│   │   ├── errorHandler.ts       # Tratamento de erros
│   │   └── validateRequest.ts    # Validação com Zod
│   │
│   ├── schemas/                  # Schemas de validação (Zod)
│   │   └── product.schema.ts     # Schemas de produto
│   │
│   ├── errors/                   # Erros personalizados
│   │   └── index.ts              # AppError, NotFoundError, etc.
│   │
│   ├── types/                    # Tipos TypeScript
│   │   └── index.ts              # Interfaces e types
│   │
│   └── utils/                    # Utilitários
│       └── logger.ts             # Configuração Winston
│
├── coverage/                     # Relatórios de cobertura
├── logs/                         # Arquivos de log
├── dist/                         # Código compilado
│
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração TypeScript
├── jest.config.ts                # Configuração Jest
├── .env                          # Variáveis de ambiente
├── .env.example                  # Exemplo de .env
└── README.md                     # Este arquivo
```

### Descrição de cada camada:

#### **Routes (Rotas)**

- Define os endpoints HTTP
- Mapeia URLs para controllers
- Aplica validações de schema
- Documentação Swagger

#### **Controllers**

- Recebe requisições HTTP
- Extrai dados (params, query, body)
- Chama services
- Retorna respostas HTTP
- **Não contém lógica de negócio**

#### **Services**

- Contém toda a lógica de negócio
- Valida regras de negócio
- Orquestra models
- Lança exceções de negócio
- **Independente do HTTP**

#### **Models**

- Define estrutura de dados
- Mapeamento com banco de dados
- Validações de schema
- Relacionamentos entre entidades

#### **Middlewares**

- Interceptam requisições
- Validação, autenticação, logging
- Tratamento de erros

---

## 🔄 Fluxo de Requisição

### Exemplo: GET /products?category=bebidas&inStock=true

```
┌────────────────────────────────────────────────┐
│  1. CLIENT                                     │
│     GET /products?category=bebidas&inStock=true│
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  2. EXPRESS APP                                │
│     • Middleware CORS                          │
│     • Middleware JSON Parser                   │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  3. ROUTER                                     │
│     routes/index.ts                            │
│     └── routes/products.routes.ts              │
│         GET /products → ProductController.index│
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  4. CONTROLLER                                 │
│     ProductController.index()                  │
│     • Extrai query params:                     │
│       - category: 'bebidas'                    │
│       - inStock: true                          │
│     • Chama service:                           │
│       productService.getAll(filters)           │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  5. SERVICE                                    │
│     ProductService.getAll()                    │
│     • Monta query conditions:                  │
│       where = {                                │
│         category: 'bebidas',                   │
│         stock: { [Op.gt]: 0 }                  │
│       }                                        │
│     • Chama model:                             │
│       Product.findAll({ where })               │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  6. MODEL (Sequelize ORM)                      │
│     Product.findAll()                          │
│     • Gera SQL:                                │
│       SELECT * FROM products                   │
│       WHERE category = 'bebidas'               │
│       AND stock > 0                            │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  7. DATABASE (SQLite)                          │
│     • Executa query                            │
│     • Retorna rows                             │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  8. SEQUELIZE                                  │
│     • Converte rows em instâncias do Model     │
│     • Retorna array de objetos Product         │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  9. SERVICE                                    │
│     • Retorna produtos para controller         │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  10. CONTROLLER                                │
│     • res.json(products)                       │
│     • Status: 200 OK                           │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  11. CLIENT                                    │
│     Response:                                  │
│     [                                          │
│       {                                        │
│         "id": 1,                               │
│         "sku": "BEB-001",                      │
│         "name": "Coca-Cola",                   │
│         "price": 5.00,                         │
│         "stock": 50,                           │
│         "category": "bebidas"                  │
│       },                                       │
│       ...                                      │
│     ]                                          │
└────────────────────────────────────────────────┘
```

### Fluxo de Tratamento de Erros

```
┌────────────────────────────────────────────────┐
│  Erro Lançado (em qualquer camada)             │
│  throw new NotFoundError('Product not found')  │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  Controller catch block                        │
│  catch (error) {                               │
│    next(error);  // Passa para error middleware│
│  }                                             │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  Error Handler Middleware                      │
│  errorHandler.ts                               │
│  • Identifica tipo de erro                     │
│  • Formata resposta                            │
│  • Loga erro                                   │
│  • Retorna status HTTP apropriado              │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  Response para Cliente                         │
│  {                                             │
│    "error": {                                  │
│      "code": "NOT_FOUND",                      │
│      "message": "Product not found"            │
│    }                                           │
│  }                                             │
│  Status: 404                                   │
└────────────────────────────────────────────────┘
```

---

## 🎨 Padrões e Design Patterns

### 1. **Separation of Concerns (Separação de Responsabilidades)**

Cada camada tem uma responsabilidade única:

- **Routes**: Roteamento HTTP
- **Controllers**: Lógica de apresentação
- **Services**: Lógica de negócio
- **Models**: Acesso a dados

**Benefícios**:

- Código mais testável
- Manutenibilidade
- Reutilização de código

### 2. **Dependency Injection (Injeção de Dependência)**

```typescript
// Service não instancia Model diretamente
// Usa o Model injetado/importado
export class ProductService {
  async getAll(filters: ProductFilters): Promise<IProduct[]> {
    return await Product.findAll({ where });
  }
}
```

### 3. **Repository Pattern (via Sequelize)**

O Sequelize age como um Repository, abstraindo o acesso ao banco:

```typescript
// Não escrevemos SQL diretamente
Product.findAll({ where: { category: 'bebidas' } });
// Sequelize gera: SELECT * FROM products WHERE category = 'bebidas'
```

### 4. **Error Handling Pattern**

Hierarquia de erros customizados:

```
AppError (base)
├── NotFoundError (404)
├── ValidationError (400)
├── ConflictError (409)
└── UnauthorizedError (401)
```

### 5. **Middleware Pattern**

Pipeline de processamento de requisições:

```typescript
app.use(cors()); // 1. CORS
app.use(express.json()); // 2. Parse JSON
app.use('/', routes); // 3. Routes
app.use(notFoundHandler); // 4. 404 Handler
app.use(errorHandler); // 5. Error Handler
```

### 6. **Factory Pattern (Sequelize Models)**

```typescript
Product.init(
  {
    /* schema */
  },
  { sequelize }
);
// Sequelize usa Factory para criar instâncias
```

### 7. **Singleton Pattern (Database Connection)**

```typescript
// Única instância da conexão com banco
export default sequelize;
```

---

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js >= 20.0.0
- npm ou yarn

### Passo a passo

```bash
# 1. Clonar repositório (se aplicável)
git clone <repository-url>
cd totem-api

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# Editar .env conforme necessário:
# PORT=3001
# NODE_ENV=development
# DB_PATH=./database.sqlite

# 4. Popular banco de dados
npm run seed

# 5. Executar em modo desenvolvimento
npm run dev

# A API estará disponível em http://localhost:3001
```

### Scripts disponíveis

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm start

# Popular banco de dados
npm run seed

# Testes
npm test                    # Executar todos os testes
npm run test:watch          # Modo watch
npm run test:coverage       # Com cobertura

# Linting e formatação
npm run lint                # Verificar problemas
npm run lint:fix            # Corrigir problemas
npm run format              # Formatar código
npm run format:check        # Verificar formatação
```

---

## 📚 Documentação da API

A documentação interativa da API está disponível via Swagger UI:

- **URL**: http://localhost:3001/api-docs
- Documentação completa de todos os endpoints
- Possibilidade de testar as requisições diretamente no navegador
- Schemas OpenAPI 3.0 com exemplos de request/response

### Como usar o Swagger:

1. Acesse http://localhost:3001/api-docs
2. Explore os endpoints disponíveis
3. Clique em um endpoint para ver detalhes
4. Clique em "Try it out" para testar
5. Preencha os parâmetros necessários
6. Clique em "Execute" para fazer a requisição
7. Veja a resposta retornada

---

## 🌐 API Endpoints

### Health Check

#### GET /health

Verificar status da API

**Resposta**:

```json
{
  "status": "ok",
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

### Produtos

#### GET /products

Listar todos os produtos com filtros opcionais

**Query Parameters**:

- `category` (string, opcional): Filtrar por categoria (ex: bebidas, lanches)
- `inStock` (boolean, opcional): true para produtos com estoque disponível
- `search` (string, opcional): Buscar por nome ou SKU

**Exemplos**:

```bash
# Todos os produtos
GET /products

# Apenas bebidas
GET /products?category=bebidas

# Produtos com estoque
GET /products?inStock=true

# Buscar por nome
GET /products?search=coca

# Combinação de filtros
GET /products?category=bebidas&inStock=true
```

**Resposta (200 OK)**:

```json
[
  {
    "id": 1,
    "sku": "BEB-001",
    "name": "Coca-Cola 350ml",
    "price": 5.0,
    "stock": 50,
    "category": "bebidas",
    "createdAt": "2026-01-27T10:00:00.000Z",
    "updatedAt": "2026-01-27T10:00:00.000Z"
  }
]
```

---

#### GET /products/:id

Buscar produto específico por ID

**Parâmetros**:

- `id` (number, obrigatório): ID do produto

**Exemplo**:

```bash
GET /products/1
```

**Resposta (200 OK)**:

```json
{
  "id": 1,
  "sku": "BEB-001",
  "name": "Coca-Cola 350ml",
  "price": 5.0,
  "stock": 50,
  "category": "bebidas",
  "createdAt": "2026-01-27T10:00:00.000Z",
  "updatedAt": "2026-01-27T10:00:00.000Z"
}
```

**Resposta (404 Not Found)**:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

#### GET /products/sku/:sku

Buscar produto por código SKU

**Parâmetros**:

- `sku` (string, obrigatório): Código SKU do produto

**Exemplo**:

```bash
GET /products/sku/BEB-001
```

**Resposta**: Igual ao GET /products/:id

---

#### POST /products

Criar novo produto

**Body (JSON)**:

```json
{
  "sku": "BEB-011",
  "name": "Suco de Laranja",
  "price": 8.5,
  "stock": 30,
  "category": "bebidas"
}
```

**Validações**:

- `sku`: string, mínimo 3 caracteres, único
- `name`: string, mínimo 3 caracteres, máximo 255
- `price`: number, maior que 0
- `stock`: integer, maior ou igual a 0
- `category`: string, não vazio

**Resposta (201 Created)**:

```json
{
  "id": 11,
  "sku": "BEB-011",
  "name": "Suco de Laranja",
  "price": 8.5,
  "stock": 30,
  "category": "bebidas",
  "createdAt": "2026-01-27T11:00:00.000Z",
  "updatedAt": "2026-01-27T11:00:00.000Z"
}
```

**Resposta (400 Bad Request)**:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "price",
        "message": "Price must be greater than 0"
      }
    ]
  }
}
```

**Resposta (409 Conflict)**:

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Product with SKU 'BEB-011' already exists"
  }
}
```

---

#### PUT /products/:id

Atualizar produto existente

**Parâmetros**:

- `id` (number, obrigatório): ID do produto

**Body (JSON)** - Todos os campos são opcionais:

```json
{
  "name": "Suco de Laranja 500ml",
  "price": 9.0,
  "stock": 25
}
```

**Resposta (200 OK)**:

```json
{
  "id": 11,
  "sku": "BEB-011",
  "name": "Suco de Laranja 500ml",
  "price": 9.0,
  "stock": 25,
  "category": "bebidas",
  "createdAt": "2026-01-27T11:00:00.000Z",
  "updatedAt": "2026-01-27T12:00:00.000Z"
}
```

---

#### DELETE /products/:id

Deletar produto

**Parâmetros**:

- `id` (number, obrigatório): ID do produto

**Exemplo**:

```bash
DELETE /products/11
```

**Resposta (204 No Content)**:

- Sem corpo de resposta
- Status: 204

---

## 🧪 Testes

### Estrutura de Testes

O projeto utiliza Jest para testes unitários e de integração:

```
src/
├── controllers/
│   ├── ProductController.ts
│   └── __tests__/
│       └── ProductController.test.ts
├── services/
│   ├── ProductService.ts
│   └── __tests__/
│       └── ProductService.test.ts
└── routes/
    └── __tests__/
        └── products.routes.test.ts
```

### Executar Testes

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com relatório de cobertura
npm run test:coverage

# Cobertura é salva em coverage/
# Abra coverage/index.html no navegador para ver relatório visual
```

### Exemplo de Teste

```typescript
describe('ProductService', () => {
  describe('getAll', () => {
    it('should return all products when no filters', async () => {
      const products = await productService.getAll({});
      expect(products).toHaveLength(10);
    });

    it('should filter by category', async () => {
      const products = await productService.getAll({
        category: 'bebidas',
      });
      expect(products.every(p => p.category === 'bebidas')).toBe(true);
    });

    it('should filter by inStock', async () => {
      const products = await productService.getAll({
        inStock: true,
      });
      expect(products.every(p => p.stock > 0)).toBe(true);
    });
  });
});
```

---

## 📝 Licença

ISC

---

## 🎓 Material para Sala de Aula

Este projeto foi desenvolvido com fins educacionais. Os principais conceitos demonstrados são:

### Conceitos de Backend

- ✅ APIs RESTful e verbos HTTP
- ✅ Arquitetura em camadas
- ✅ Separação de responsabilidades
- ✅ Padrões de projeto (MVC, Repository, etc.)

### TypeScript e Node.js

- ✅ Type safety e interfaces
- ✅ Async/await e Promises
- ✅ Módulos ES6
- ✅ Tratamento de erros

### Banco de Dados

- ✅ ORM (Sequelize)
- ✅ Migrations e seeds
- ✅ Relacionamentos e queries

### Boas Práticas

- ✅ Validação de dados
- ✅ Tratamento de erros centralizado
- ✅ Logging estruturado
- ✅ Documentação de API
- ✅ Testes automatizados
- ✅ Linting e formatação de código

### DevOps

- ✅ Variáveis de ambiente
- ✅ Scripts de build e deploy
- ✅ Hot reload em desenvolvimento
