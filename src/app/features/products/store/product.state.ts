import { ILoadingState } from '@app/shared';
import { IProduct, IProductFilters } from '../models/product.model';

export interface IProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  filters: IProductFilters;
  loading: ILoadingState;
  error: string | null;
}

export const initialProductState: IProductState = {
  products: [],
  selectedProduct: null,
  filters: {},
  loading: 'idle',
  error: null,
};
