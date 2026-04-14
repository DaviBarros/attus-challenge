export type PhoneType = 'celular' | 'residencial' | 'comercial';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
}
