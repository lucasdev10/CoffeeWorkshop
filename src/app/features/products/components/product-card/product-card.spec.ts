import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('product', {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      image: 'test-image.jpg',
      category: 'Test Category',
      stock: 10,
      rating: 4.5,
      createdAt: 1234567890,
      updatedAt: 1234567890,
    });

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
