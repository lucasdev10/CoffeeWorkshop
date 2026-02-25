import { inject, Injectable } from '@angular/core';
import { MockDataService } from '@app/core/data/mock-data.service';
import { Observable } from 'rxjs';
import { CreateProductDto, Product, UpdateProductDto } from '../models/product.model';

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
  findAll(): Observable<Product[]> {
    return this.mockData.get<Product[]>(this.COLLECTION_KEY);
  }

  /**
   * Busca produto por ID
   */
  findById(id: string): Observable<Product> {
    return this.mockData.getById<Product>(this.COLLECTION_KEY, id);
  }

  /**
   * Cria novo produto
   */
  create(dto: CreateProductDto): Observable<Product> {
    const product: Partial<Product> = {
      ...dto,
      image: dto.image || '/assets/images/coffee.jpg',
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.mockData.post<Product>(this.COLLECTION_KEY, product as Product);
  }

  /**
   * Atualiza produto existente
   */
  update(id: string, dto: UpdateProductDto): Observable<Product> {
    const updateData: Partial<Product> = {
      ...dto,
      updatedAt: new Date(),
    };

    return this.mockData.put<Product>(this.COLLECTION_KEY, id, updateData as Product);
  }

  /**
   * Remove produto
   */
  delete(id: string): Observable<void> {
    return this.mockData.delete(this.COLLECTION_KEY, id);
  }
}
