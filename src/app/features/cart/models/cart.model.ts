import { Product } from '@app/features/products/models/product.model';

/**
 * Item do carrinho
 */
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number; // price * quantity
}

/**
 * Carrinho de compras
 */
export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

/**
 * DTO para adicionar item ao carrinho
 */
export interface AddToCartDto {
  productId: string;
  quantity: number;
}

/**
 * DTO para atualizar quantidade
 */
export interface UpdateCartItemDto {
  productId: string;
  quantity: number;
}
