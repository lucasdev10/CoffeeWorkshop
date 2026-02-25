/**
 * Status de pedidos
 */
export enum OrderStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED',
  Refunded = 'REFUNDED',
}

/**
 * Labels para exibição
 */
export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Processing]: 'Processing',
  [OrderStatus.Shipped]: 'Shipped',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Cancelled]: 'Cancelled',
  [OrderStatus.Refunded]: 'Refunded',
};

/**
 * Cores para cada status
 */
export const OrderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'warn',
  [OrderStatus.Processing]: 'accent',
  [OrderStatus.Shipped]: 'primary',
  [OrderStatus.Delivered]: 'success',
  [OrderStatus.Cancelled]: 'error',
  [OrderStatus.Refunded]: 'warn',
};
