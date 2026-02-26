import { Injectable } from '@angular/core';
import { IUserRole } from '@app/features/user/models/user.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';

export const STORAGE_MOCK = new Map<string, unknown>();

/**
 * Serviço centralizado para gerenciar dados mock
 */
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  constructor() {
    this.initializeMockData();
  }

  /**
   * Inicializa dados mock no "banco de dados" simulado
   */
  private initializeMockData(): void {
    // Produtos iniciais
    const products = [
      {
        id: Utils.generateId(),
        name: 'Premium Coffee Beans',
        description: 'Arabica blend from Colombia with rich flavor notes',
        price: 29.99,
        image: '/assets/images/coffee.jpg',
        category: 'Food',
        stock: 50,
        rating: 4.5,
        createdAt: moment('2024-01-01').unix(),
        updatedAt: moment('2024-01-01').unix(),
      },
      {
        id: Utils.generateId(),
        name: 'Espresso Machine Pro',
        description: 'Professional grade espresso maker with 15 bar pressure',
        price: 499.99,
        image: '/assets/images/coffee.jpg',
        category: 'Electronics',
        stock: 15,
        rating: 4.8,
        createdAt: moment('2024-01-02').unix(),
        updatedAt: moment('2024-01-02').unix(),
      },
      {
        id: Utils.generateId(),
        name: 'Coffee Grinder Deluxe',
        description: 'Precision burr grinder with 15 settings',
        price: 79.99,
        image: '/assets/images/coffee.jpg',
        category: 'Electronics',
        stock: 8,
        rating: 4.3,
        createdAt: moment('2024-01-03').unix(),
        updatedAt: moment('2024-01-03').unix(),
      },
    ];

    STORAGE_MOCK.set('products', products);

    // Usuários iniciais
    const users = [
      {
        id: Utils.generateId(),
        email: 'admin@admin.com',
        password: 'admin123',
        name: 'Admin User',
        role: IUserRole.ADMIN,
      },
      {
        id: Utils.generateId(),
        email: 'user@user.com',
        password: 'user123',
        name: 'Regular User',
        role: IUserRole.USER,
      },
    ];

    STORAGE_MOCK.set('users', users);
  }

  /**
   * Limpa todos os dados (útil para testes)
   */
  clear(): void {
    STORAGE_MOCK.clear();
    this.initializeMockData();
  }
}
