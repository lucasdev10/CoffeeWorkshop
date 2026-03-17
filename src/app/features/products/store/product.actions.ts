import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ICreateProductDto, IProduct } from '../models/product.model';
import { IProductFilters, IUpdateProductDto } from './../models/product.model';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: IProduct[] }>(),
    'Load Products Error': props<{ error: string }>(),
    'Load Product By Id': props<{ id: string }>(),
    'Load Product By Id Success': props<{ product: IProduct }>(),
    'Load Product By Id Error': props<{ error: string }>(),
    'Create Product': props<{ product: ICreateProductDto }>(),
    'Create Product Success': props<{ product: IProduct }>(),
    'Create Product Error': props<{ error: string }>(),
    'Update Product': props<{ id: string; product: IUpdateProductDto }>(),
    'Update Product Success': props<{ product: IProduct }>(),
    'Update Product Error': props<{ error: string }>(),
    'Delete Product': props<{ id: string }>(),
    'Delete Product Success': props<{ id: string }>(),
    'Delete Product Error': props<{ error: string }>(),
    'Set Product Filters': props<{ filters: IProductFilters }>(),
    'Clean Product Filters': emptyProps(),
  },
});
