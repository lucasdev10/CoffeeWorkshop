import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores customizados para formulários
 */
export class CustomValidators {
  /**
   * Valida se o valor é um email válido
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegex.test(control.value);

      return valid ? null : { email: { value: control.value } };
    };
  }

  /**
   * Valida senha forte
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumeric = /[0-9]/.test(control.value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
      const isLengthValid = control.value.length >= 8;

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isLengthValid;

      return passwordValid
        ? null
        : {
            strongPassword: {
              hasUpperCase,
              hasLowerCase,
              hasNumeric,
              hasSpecialChar,
              isLengthValid,
            },
          };
    };
  }

  /**
   * Valida se dois campos são iguais (ex: senha e confirmação)
   */
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;

      if (!value1 || !value2) {
        return null;
      }

      return value1 === value2 ? null : { matchFields: { field1, field2 } };
    };
  }

  /**
   * Valida URL
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      try {
        new URL(control.value);
        return null;
      } catch {
        return { url: { value: control.value } };
      }
    };
  }

  /**
   * Valida número de telefone (formato brasileiro)
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
      const valid = phoneRegex.test(control.value);

      return valid ? null : { phone: { value: control.value } };
    };
  }

  /**
   * Valida CPF
   */
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const cpf = control.value.replace(/\D/g, '');

      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return { cpf: { value: control.value } };
      }

      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }

      let remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.charAt(9))) {
        return { cpf: { value: control.value } };
      }

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }

      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.charAt(10))) {
        return { cpf: { value: control.value } };
      }

      return null;
    };
  }

  /**
   * Valida valor mínimo (para números)
   */
  static minValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }

      const value = parseFloat(control.value);
      return value >= min ? null : { minValue: { min, actual: value } };
    };
  }

  /**
   * Valida valor máximo (para números)
   */
  static maxValue(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }

      const value = parseFloat(control.value);
      return value <= max ? null : { maxValue: { max, actual: value } };
    };
  }
}
