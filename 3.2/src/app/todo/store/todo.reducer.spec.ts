import { describe, it, expect } from 'vitest';
import { todoReducer, initialState } from './todo.reducer';
import {
  loadTodos,
  loadTodosSuccess,
  loadTodosError,
  toggleTodoComplete,
} from './todo.actions';
import { Todo, TodoState } from '../todo.model';

const mockTodos: Todo[] = [
  { id: 1, title: 'Tarefa 1', completed: false, createdAt: '2024-01-01' },
  { id: 2, title: 'Tarefa 2', completed: true, createdAt: '2024-01-02' },
  { id: 3, title: 'Tarefa 3', completed: false, createdAt: '2024-01-03' },
];

describe('todoReducer', () => {
  // ---- Estado inicial ----
  describe('Estado inicial', () => {
    it('deve retornar o estado inicial quando não há ação correspondente', () => {
      const state = todoReducer(undefined, { type: '@@INIT' } as never);
      expect(state).toEqual(initialState);
    });

    it('estado inicial deve ter todos vazio, loading false e error null', () => {
      expect(initialState.todos).toEqual([]);
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  // ---- loadTodos ----
  describe('loadTodos', () => {
    it('deve definir loading como true e limpar o erro', () => {
      const stateWithError: TodoState = { ...initialState, error: 'Erro anterior' };
      const state = todoReducer(stateWithError, loadTodos());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('não deve alterar a lista de todos existente durante o carregamento', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const state = todoReducer(stateWithTodos, loadTodos());

      expect(state.todos).toEqual(mockTodos);
    });
  });

  // ---- loadTodosSuccess ----
  describe('loadTodosSuccess', () => {
    it('deve armazenar os todos e definir loading como false', () => {
      const loadingState: TodoState = { ...initialState, loading: true };
      const state = todoReducer(loadingState, loadTodosSuccess({ todos: mockTodos }));

      expect(state.todos).toEqual(mockTodos);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('deve substituir todos existentes pelos novos', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: [mockTodos[0]] };
      const state = todoReducer(stateWithTodos, loadTodosSuccess({ todos: mockTodos }));

      expect(state.todos.length).toBe(mockTodos.length);
    });
  });

  // ---- loadTodosError ----
  describe('loadTodosError', () => {
    it('deve armazenar a mensagem de erro e definir loading como false', () => {
      const loadingState: TodoState = { ...initialState, loading: true };
      const errorMessage = 'Falha na conexão';
      const state = todoReducer(loadingState, loadTodosError({ error: errorMessage }));

      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });

    it('não deve alterar a lista de todos em caso de erro', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const state = todoReducer(stateWithTodos, loadTodosError({ error: 'Erro' }));

      expect(state.todos).toEqual(mockTodos);
    });
  });

  // ---- toggleTodoComplete ----
  describe('toggleTodoComplete', () => {
    it('deve marcar como concluída uma tarefa pendente', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const state = todoReducer(stateWithTodos, toggleTodoComplete({ id: 1 }));

      const todo = state.todos.find((t) => t.id === 1);
      expect(todo?.completed).toBe(true);
    });

    it('deve marcar como pendente uma tarefa concluída', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const state = todoReducer(stateWithTodos, toggleTodoComplete({ id: 2 }));

      const todo = state.todos.find((t) => t.id === 2);
      expect(todo?.completed).toBe(false);
    });

    it('não deve alterar outras tarefas ao fazer toggle', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const state = todoReducer(stateWithTodos, toggleTodoComplete({ id: 1 }));

      const todo2 = state.todos.find((t) => t.id === 2);
      const todo3 = state.todos.find((t) => t.id === 3);
      expect(todo2?.completed).toBe(true);
      expect(todo3?.completed).toBe(false);
    });

    it('não deve alterar o estado para id inexistente', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const state = todoReducer(stateWithTodos, toggleTodoComplete({ id: 99 }));

      expect(state.todos).toEqual(mockTodos);
    });

    it('deve ser imutável (não modificar o estado original)', () => {
      const stateWithTodos: TodoState = { ...initialState, todos: mockTodos };
      const newState = todoReducer(stateWithTodos, toggleTodoComplete({ id: 1 }));

      expect(newState).not.toBe(stateWithTodos);
      expect(newState.todos).not.toBe(stateWithTodos.todos);
    });
  });
});
