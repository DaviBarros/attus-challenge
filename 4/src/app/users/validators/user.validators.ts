import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida CPF: exatamente 11 dígitos numéricos.
 * Aceita entrada com ou sem formatação (pontos e traço são removidos).
 */
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const cpf = control.value.replace(/\D/g, '');

    if (cpf.length !== 11) {
      return { cpfInvalid: { message: 'CPF deve ter exatamente 11 dígitos' } };
    }

    // Verifica sequências inválidas (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cpf)) {
      return { cpfInvalid: { message: 'CPF inválido' } };
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) {
      return { cpfInvalid: { message: 'CPF inválido' } };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) {
      return { cpfInvalid: { message: 'CPF inválido' } };
    }

    return null;
  };
}

/**
 * Valida telefone brasileiro.
 * Aceita formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const phone = control.value.replace(/\D/g, '');

    if (phone.length < 10 || phone.length > 11) {
      return { phoneInvalid: { message: 'Telefone deve ter 10 ou 11 dígitos' } };
    }

    return null;
  };
}

/**
 * Aplica máscara de CPF: XXX.XXX.XXX-XX
 */
export function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Aplica máscara de telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
