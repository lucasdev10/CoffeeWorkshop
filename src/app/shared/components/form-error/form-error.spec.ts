import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormError } from './form-error';

describe('FormError', () => {
  let component: FormError;
  let fixture: ComponentFixture<FormError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormError],
    }).compileComponents();

    fixture = TestBed.createComponent(FormError);
    component = fixture.componentInstance;

    // Criar um mock de control que retorna um objeto com os métodos esperados
    component.control = signal({
      invalid: () => false,
      touched: () => false,
      errors: () => [],
      pending: () => false,
    }) as any;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
