/**
 * Modelo de domínio para Produto
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para criação de produto (sem campos gerados automaticamente)
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
}

/**
 * DTO para atualização de produto (todos os campos opcionais)
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  stock?: number;
}

/**
 * Filtros para busca de produtos
 */
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}
