import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import {
  cpfValidator,
  phoneValidator,
  applyCpfMask,
  applyPhoneMask,
} from './user.validators';

describe('cpfValidator()', () => {
  const validate = (value: string) => cpfValidator()(new FormControl(value));

  it('deve aceitar CPF válido', () => {
    expect(validate('529.982.247-25')).toBeNull();
  });

  it('deve rejeitar CPF com menos de 11 dígitos', () => {
    const result = validate('123.456.789');
    expect(result).not.toBeNull();
    expect(result?.['cpfInvalid']).toBeDefined();
  });

  it('deve rejeitar CPF com todos os dígitos iguais', () => {
    const result = validate('111.111.111-11');
    expect(result).not.toBeNull();
    expect(result?.['cpfInvalid']).toBeDefined();
  });

  it('deve rejeitar CPF com dígitos verificadores inválidos', () => {
    const result = validate('123.456.789-00');
    expect(result).not.toBeNull();
    expect(result?.['cpfInvalid']).toBeDefined();
  });

  it('deve retornar null para valor vazio (campo não preenchido)', () => {
    expect(validate('')).toBeNull();
  });

  it('deve aceitar CPF sem formatação (somente dígitos)', () => {
    expect(validate('52998224725')).toBeNull();
  });
});

describe('phoneValidator()', () => {
  const validate = (value: string) => phoneValidator()(new FormControl(value));

  it('deve aceitar telefone celular válido', () => {
    expect(validate('(11) 99999-9999')).toBeNull();
  });

  it('deve aceitar telefone fixo válido', () => {
    expect(validate('(11) 3333-4444')).toBeNull();
  });

  it('deve rejeitar telefone com menos de 10 dígitos', () => {
    const result = validate('(11) 999');
    expect(result).not.toBeNull();
    expect(result?.['phoneInvalid']).toBeDefined();
  });

  it('deve rejeitar telefone com mais de 11 dígitos', () => {
    const result = validate('(11) 999999-99999');
    expect(result).not.toBeNull();
    expect(result?.['phoneInvalid']).toBeDefined();
  });

  it('deve retornar null para valor vazio', () => {
    expect(validate('')).toBeNull();
  });
});

describe('applyCpfMask()', () => {
  it('deve formatar CPF com 11 dígitos', () => {
    expect(applyCpfMask('52998224725')).toBe('529.982.247-25');
  });

  it('deve formatar CPF parcialmente (3 dígitos)', () => {
    expect(applyCpfMask('529')).toBe('529');
  });

  it('deve formatar CPF parcialmente (6 dígitos)', () => {
    expect(applyCpfMask('529982')).toBe('529.982');
  });

  it('deve formatar CPF parcialmente (9 dígitos)', () => {
    expect(applyCpfMask('529982247')).toBe('529.982.247');
  });

  it('deve ignorar caracteres não numéricos', () => {
    expect(applyCpfMask('529.982.247-25')).toBe('529.982.247-25');
  });

  it('deve limitar a 11 dígitos', () => {
    expect(applyCpfMask('529982247251234')).toBe('529.982.247-25');
  });
});

describe('applyPhoneMask()', () => {
  it('deve formatar celular com 11 dígitos', () => {
    expect(applyPhoneMask('11999999999')).toBe('(11) 99999-9999');
  });

  it('deve formatar fixo com 10 dígitos', () => {
    expect(applyPhoneMask('1133334444')).toBe('(11) 3333-4444');
  });

  it('deve formatar parcialmente (2 dígitos)', () => {
    expect(applyPhoneMask('11')).toBe('(11');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    expect(applyPhoneMask('')).toBe('');
  });

  it('deve ignorar caracteres não numéricos', () => {
    expect(applyPhoneMask('(11) 99999-9999')).toBe('(11) 99999-9999');
  });
});
