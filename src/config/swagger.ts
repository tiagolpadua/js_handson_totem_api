import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Totem API',
      version: '1.0.0',
      description:
        'API Backend para o sistema Totem - JSE02 Javascript Expert Hands-on. Sistema de gerenciamento de produtos para totens de autoatendimento.',
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['sku', 'name', 'price', 'stock', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID (auto-generated)',
              example: 1,
            },
            sku: {
              type: 'string',
              description: 'Product SKU (unique)',
              example: 'BEB-0001',
            },
            name: {
              type: 'string',
              description: 'Product name',
              minLength: 3,
              maxLength: 255,
              example: 'Coca-Cola 350ml',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Product price',
              minimum: 0,
              example: 5.5,
            },
            stock: {
              type: 'integer',
              description: 'Product stock quantity',
              minimum: 0,
              example: 25,
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'refrigerante',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['sku', 'name', 'price', 'stock', 'category'],
          properties: {
            sku: {
              type: 'string',
              description: 'Product SKU (unique)',
              example: 'BEB-0011',
            },
            name: {
              type: 'string',
              description: 'Product name',
              minLength: 3,
              maxLength: 255,
              example: 'Produto Novo',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Product price',
              minimum: 0,
              example: 10.5,
            },
            stock: {
              type: 'integer',
              description: 'Product stock quantity',
              minimum: 0,
              example: 100,
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'bebida',
            },
          },
        },
        ProductUpdate: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
              description: 'Product SKU',
              example: 'BEB-0011',
            },
            name: {
              type: 'string',
              description: 'Product name',
              example: 'Produto Atualizado',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Product price',
              example: 12.5,
            },
            stock: {
              type: 'integer',
              description: 'Product stock quantity',
              example: 80,
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'bebida',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'NOT_FOUND',
                },
                message: {
                  type: 'string',
                  example: 'Produto não encontrado',
                },
                details: {
                  type: 'object',
                  description: 'Additional error details (only in development)',
                },
              },
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Erro de validação',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'name',
                      },
                      message: {
                        type: 'string',
                        example: 'Field is required',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
