import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IProduct } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, CurrencyPipe, MatIconModule, MatButtonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  // Inputs usando signal-based API
  product = input.required<IProduct>();

  // Outputs usando signal-based API
  addToCart = output<IProduct>();

  onAddToCart(): void {
    this.addToCart.emit(this.product());
  }
}
