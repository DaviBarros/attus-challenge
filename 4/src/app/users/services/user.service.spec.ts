/// <reference types="vitest/globals" />
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { UserFormData } from '../user.model';

// Testes sem TestBed — instanciação direta do serviço
// O UserService usa apenas arrays estáticos e RxJS, sem necessidade de DI
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  // ---- getUsers ----
  describe('getUsers()', () => {
    it('deve retornar um Observable com a lista de usuários', async () => {
      const users = await firstValueFrom(service.getUsers());
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('deve retornar usuários com todos os campos obrigatórios', async () => {
      const users = await firstValueFrom(service.getUsers());
      users.forEach((user) => {
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.cpf).toBeDefined();
        expect(user.phone).toBeDefined();
        expect(user.phoneType).toBeDefined();
      });
    });

    it('deve retornar uma cópia do array (imutabilidade)', async () => {
      const users1 = await firstValueFrom(service.getUsers());
      const users2 = await firstValueFrom(service.getUsers());
      expect(users1).not.toBe(users2);
    });
  });

  // ---- searchUsers ----
  describe('searchUsers()', () => {
    it('deve retornar todos os usuários quando o termo estiver vazio', async () => {
      const all = await firstValueFrom(service.getUsers());
      const result = await firstValueFrom(service.searchUsers(''));
      expect(result.length).toBe(all.length);
    });

    it('deve filtrar usuários pelo nome (case-insensitive)', async () => {
      const result = await firstValueFrom(service.searchUsers('ana'));
      expect(result.length).toBeGreaterThan(0);
      result.forEach((u) => {
        expect(u.name.toLowerCase()).toContain('ana');
      });
    });

    it('deve retornar array vazio para termo sem correspondência', async () => {
      const result = await firstValueFrom(service.searchUsers('xyznotexistent123'));
      expect(result).toEqual([]);
    });

    it('deve ser case-insensitive na busca', async () => {
      const resultUpper = await firstValueFrom(service.searchUsers('ANA'));
      const resultLower = await firstValueFrom(service.searchUsers('ana'));
      expect(resultUpper.length).toBe(resultLower.length);
    });
  });

  // ---- createUser ----
  describe('createUser()', () => {
    it('deve criar um novo usuário com id único', async () => {
      const newUser: UserFormData = {
        name: 'Teste Usuário',
        email: 'teste@email.com',
        cpf: '52998224725',
        phone: '(11) 99999-9999',
        phoneType: 'celular',
      };

      const created = await firstValueFrom(service.createUser(newUser));
      expect(created.id).toBeDefined();
      expect(created.name).toBe(newUser.name);
      expect(created.email).toBe(newUser.email);
      expect(created.cpf).toBe(newUser.cpf);
      expect(created.phoneType).toBe(newUser.phoneType);
      expect(created.createdAt).toBeDefined();
    });

    it('deve incrementar o id a cada criação', async () => {
      const userData: UserFormData = {
        name: 'Usuário A',
        email: 'a@email.com',
        cpf: '52998224725',
        phone: '(11) 99999-9999',
        phoneType: 'celular',
      };

      const first = await firstValueFrom(service.createUser(userData));
      const second = await firstValueFrom(
        service.createUser({ ...userData, name: 'Usuário B', email: 'b@email.com' })
      );
      expect(second.id).toBeGreaterThan(first.id);
    });

    it('deve adicionar o usuário criado à lista', async () => {
      const newUser: UserFormData = {
        name: 'Novo Usuário',
        email: 'novo@email.com',
        cpf: '52998224725',
        phone: '(11) 99999-9999',
        phoneType: 'comercial',
      };

      const created = await firstValueFrom(service.createUser(newUser));
      const users = await firstValueFrom(service.getUsers());
      const found = users.find((u) => u.id === created.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe(newUser.name);
    });
  });

  // ---- updateUser ----
  describe('updateUser()', () => {
    it('deve atualizar os dados de um usuário existente', async () => {
      const users = await firstValueFrom(service.getUsers());
      const user = users[0];
      const updatedData: UserFormData = {
        name: 'Nome Atualizado',
        email: 'atualizado@email.com',
        cpf: user.cpf,
        phone: user.phone,
        phoneType: user.phoneType,
      };

      const updated = await firstValueFrom(service.updateUser(user.id, updatedData));
      expect(updated.name).toBe('Nome Atualizado');
      expect(updated.email).toBe('atualizado@email.com');
      expect(updated.id).toBe(user.id);
    });

    it('deve retornar erro para id inexistente', () => {
      return new Promise<void>((resolve, reject) => {
        const data: UserFormData = {
          name: 'Teste',
          email: 'teste@email.com',
          cpf: '52998224725',
          phone: '(11) 99999-9999',
          phoneType: 'celular',
        };

        service.updateUser(99999, data).subscribe({
          next: () => reject(new Error('Deveria ter lançado erro')),
          error: (err) => {
            expect(err.message).toContain('99999');
            resolve();
          },
        });
      });
    });
  });

  // ---- deleteUser ----
  describe('deleteUser()', () => {
    it('deve remover o usuário da lista', async () => {
      const users = await firstValueFrom(service.getUsers());
      const user = users[0];

      await firstValueFrom(service.deleteUser(user.id));
      const updatedUsers = await firstValueFrom(service.getUsers());
      const found = updatedUsers.find((u) => u.id === user.id);
      expect(found).toBeUndefined();
    });
  });

  // ---- getUserById ----
  describe('getUserById()', () => {
    it('deve retornar o usuário correto pelo id', async () => {
      const users = await firstValueFrom(service.getUsers());
      const user = users[0];
      const found = service.getUserById(user.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(user.id);
    });

    it('deve retornar undefined para id inexistente', () => {
      const found = service.getUserById(99999);
      expect(found).toBeUndefined();
    });
  });
});
