import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, map, catchError, switchMap, tap } from 'rxjs/operators';
import { User, UserFormData } from '../user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  // ---- Dados mockados (array estático) ----
  private usersData: User[] = [
    {
      id: 1,
      name: 'Ana Carolina Silva',
      email: 'ana.silva@email.com',
      cpf: '12345678901',
      phone: '(11) 98765-4321',
      phoneType: 'celular',
      createdAt: '2024-01-10',
    },
    {
      id: 2,
      name: 'Bruno Ferreira Santos',
      email: 'bruno.santos@empresa.com',
      cpf: '98765432100',
      phone: '(21) 3456-7890',
      phoneType: 'comercial',
      createdAt: '2024-01-15',
    },
    {
      id: 3,
      name: 'Carla Mendes Oliveira',
      email: 'carla.oliveira@gmail.com',
      cpf: '45678912345',
      phone: '(31) 99876-5432',
      phoneType: 'celular',
      createdAt: '2024-01-20',
    },
    {
      id: 4,
      name: 'Daniel Costa Pereira',
      email: 'daniel.pereira@hotmail.com',
      cpf: '78912345678',
      phone: '(41) 3234-5678',
      phoneType: 'residencial',
      createdAt: '2024-02-01',
    },
    {
      id: 5,
      name: 'Eduarda Lima Rodrigues',
      email: 'eduarda.rodrigues@email.com',
      cpf: '32165498700',
      phone: '(51) 97654-3210',
      phoneType: 'celular',
      createdAt: '2024-02-10',
    },
    {
      id: 6,
      name: 'Felipe Araújo Nascimento',
      email: 'felipe.nascimento@corp.com',
      cpf: '65432198765',
      phone: '(61) 3345-6789',
      phoneType: 'comercial',
      createdAt: '2024-02-15',
    },
    {
      id: 7,
      name: 'Gabriela Torres Alves',
      email: 'gabriela.alves@email.com',
      cpf: '11122233344',
      phone: '(71) 98765-1234',
      phoneType: 'celular',
      createdAt: '2024-02-20',
    },
    {
      id: 8,
      name: 'Henrique Barbosa Martins',
      email: 'henrique.martins@gmail.com',
      cpf: '55566677788',
      phone: '(81) 3456-7891',
      phoneType: 'residencial',
      createdAt: '2024-03-01',
    },
  ];

  private nextId = 9;

  // ---- BehaviorSubject interno para reatividade ----
  private readonly _users$ = new BehaviorSubject<User[]>(this.usersData);

  // ---- Signal para estado reativo dos usuários (Angular Signals) ----
  private readonly usersSignal = signal<User[]>([...this.usersData]);

  // Exposto como readonly para uso em componentes
  readonly usersState = computed(() => this.usersSignal());

  /**
   * Retorna todos os usuários com delay simulado de rede.
   * Usa: map, delay (operadores RxJS além de tap)
   */
  getUsers(): Observable<User[]> {
    return of(this.usersData).pipe(
      delay(600),
      map((users) => [...users]),
      tap((users) => console.log(`[UserService] ${users.length} usuários carregados`)),
      catchError((err) => {
        console.error('[UserService] Erro ao carregar usuários:', err);
        return throwError(() => new Error('Falha ao carregar usuários'));
      })
    );
  }

  /**
   * Busca usuários com filtro por nome.
   * Usa: switchMap, map, catchError
   */
  searchUsers(term: string): Observable<User[]> {
    return of(term).pipe(
      switchMap((searchTerm) => {
        const filtered = this.usersData.filter((u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return of(filtered).pipe(delay(400));
      }),
      map((users) => [...users]),
      catchError((err) => {
        console.error('[UserService] Erro na busca:', err);
        return throwError(() => new Error('Falha na busca de usuários'));
      })
    );
  }

  /**
   * Cria um novo usuário.
   */
  createUser(data: UserFormData): Observable<User> {
    const newUser: User = {
      id: this.nextId++,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.usersData = [...this.usersData, newUser];
    this._users$.next(this.usersData);
    this.usersSignal.set([...this.usersData]);
    return of(newUser).pipe(delay(400));
  }

  /**
   * Atualiza um usuário existente.
   */
  updateUser(id: number, data: UserFormData): Observable<User> {
    const index = this.usersData.findIndex((u) => u.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Usuário ${id} não encontrado`));
    }
    const updated: User = { ...this.usersData[index], ...data };
    this.usersData = this.usersData.map((u) => (u.id === id ? updated : u));
    this._users$.next(this.usersData);
    this.usersSignal.set([...this.usersData]);
    return of(updated).pipe(delay(400));
  }

  /**
   * Remove um usuário.
   */
  deleteUser(id: number): Observable<void> {
    this.usersData = this.usersData.filter((u) => u.id !== id);
    this._users$.next(this.usersData);
    this.usersSignal.set([...this.usersData]);
    return of(undefined).pipe(delay(300));
  }

  getUserById(id: number): User | undefined {
    return this.usersData.find((u) => u.id === id);
  }
}
