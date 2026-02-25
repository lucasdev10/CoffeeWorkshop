/**
 * Métodos de pagamento
 */
export enum PaymentMethod {
  CreditCard = 'CREDIT_CARD',
  DebitCard = 'DEBIT_CARD',
  Pix = 'PIX',
  Boleto = 'BOLETO',
  PayPal = 'PAYPAL',
}

/**
 * Labels para exibição
 */
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CreditCard]: 'Credit Card',
  [PaymentMethod.DebitCard]: 'Debit Card',
  [PaymentMethod.Pix]: 'PIX',
  [PaymentMethod.Boleto]: 'Boleto',
  [PaymentMethod.PayPal]: 'PayPal',
};

/**
 * Ícones para cada método
 */
export const PaymentMethodIcons: Record<PaymentMethod, string> = {
  [PaymentMethod.CreditCard]: 'credit_card',
  [PaymentMethod.DebitCard]: 'credit_card',
  [PaymentMethod.Pix]: 'qr_code',
  [PaymentMethod.Boleto]: 'receipt',
  [PaymentMethod.PayPal]: 'account_balance',
};
