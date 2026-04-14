import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  // URL fictícia conforme especificação — dados são mockados localmente
  private readonly apiUrl = 'https://api.attus-challenge.com/todos';

  private readonly mockTodos: Todo[] = [
    { id: 1, title: 'Implementar Angular Signals no carrinho', completed: true, createdAt: '2024-01-15' },
    { id: 2, title: 'Configurar NgRx Store com Actions e Reducers', completed: true, createdAt: '2024-01-16' },
    { id: 3, title: 'Criar seletores selectAllTodos e selectPendingTodos', completed: false, createdAt: '2024-01-17' },
    { id: 4, title: 'Implementar Effects com chamada HTTP mockada', completed: false, createdAt: '2024-01-18' },
    { id: 5, title: 'Criar tela de listagem de usuários com debounce', completed: false, createdAt: '2024-01-19' },
    { id: 6, title: 'Implementar modal de cadastro com formulário reativo', completed: false, createdAt: '2024-01-20' },
    { id: 7, title: 'Adicionar validações de CPF, e-mail e telefone', completed: false, createdAt: '2024-01-21' },
    { id: 8, title: 'Escrever testes unitários com cobertura acima de 60%', completed: false, createdAt: '2024-01-22' },
  ];

  constructor(private http: HttpClient) {}

  /**
   * Busca todos via HTTP (mockado com dados estáticos e delay simulado).
   * Em produção, substituir pelo endpoint real.
   */
  getTodos(): Observable<Todo[]> {
    // Simula chamada HTTP com delay de rede
    return of(this.mockTodos).pipe(
      delay(800),
      map((todos) => todos)
    );
  }
}
