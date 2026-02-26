import { inject, Injectable } from '@angular/core';
import { MockDataService } from '@app/core/data/mock-data.service';
import { Observable } from 'rxjs';
import { ICreateProductDto, IProduct, IUpdateProductDto } from '../models/product.model';

/**
 * Repository Pattern para Products
 * Abstrai a camada de dados, facilitando troca futura para API real
 */
@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  private readonly mockData = inject(MockDataService);
  private readonly COLLECTION_KEY = 'products';

  /**
   * Busca todos os produtos
   */
  findAll(): Observable<IProduct[]> {
    return this.mockData.get<IProduct[]>(this.COLLECTION_KEY);
  }

  /**
   * Busca produto por ID
   */
  findById(id: string): Observable<IProduct> {
    return this.mockData.getById<IProduct>(this.COLLECTION_KEY, id);
  }

  /**
   * Cria novo produto
   */
  create(dto: ICreateProductDto): Observable<IProduct> {
    const product: Partial<IProduct> = {
      ...dto,
      image: dto.image || '/assets/images/coffee.jpg',
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.mockData.post<IProduct>(this.COLLECTION_KEY, product as IProduct);
  }

  /**
   * Atualiza produto existente
   */
  update(id: string, dto: IUpdateProductDto): Observable<IProduct> {
    const updateData: Partial<IProduct> = {
      ...dto,
      updatedAt: new Date(),
    };

    return this.mockData.put<IProduct>(this.COLLECTION_KEY, id, updateData as IProduct);
  }

  /**
   * Remove produto
   */
  delete(id: string): Observable<void> {
    return this.mockData.delete(this.COLLECTION_KEY, id);
  }
}
