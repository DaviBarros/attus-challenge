import { describe, it, expect } from 'vitest';
import {
  selectAllTodos,
  selectPendingTodos,
  selectCompletedTodos,
  selectTodosLoading,
  selectTodosError,
  selectTodosStats,
} from './todo.selectors';
import { TodoState } from '../todo.model';

const mockState = {
  todos: {
    todos: [
      { id: 1, title: 'Tarefa 1', completed: false, createdAt: '2024-01-01' },
      { id: 2, title: 'Tarefa 2', completed: true, createdAt: '2024-01-02' },
      { id: 3, title: 'Tarefa 3', completed: false, createdAt: '2024-01-03' },
      { id: 4, title: 'Tarefa 4', completed: true, createdAt: '2024-01-04' },
    ],
    loading: false,
    error: null,
  } as TodoState,
};

describe('Todo Selectors', () => {
  // ---- selectAllTodos ----
  describe('selectAllTodos', () => {
    it('deve retornar todos os todos', () => {
      const result = selectAllTodos(mockState);
      expect(result.length).toBe(4);
    });

    it('deve retornar array vazio quando não há todos', () => {
      const emptyState = { todos: { todos: [], loading: false, error: null } };
      expect(selectAllTodos(emptyState)).toEqual([]);
    });
  });

  // ---- selectPendingTodos ----
  describe('selectPendingTodos', () => {
    it('deve retornar apenas tarefas não concluídas', () => {
      const result = selectPendingTodos(mockState);
      expect(result.length).toBe(2);
      result.forEach((todo) => expect(todo.completed).toBe(false));
    });

    it('deve retornar array vazio quando todas as tarefas estão concluídas', () => {
      const allDoneState = {
        todos: {
          todos: [
            { id: 1, title: 'T1', completed: true, createdAt: '2024-01-01' },
            { id: 2, title: 'T2', completed: true, createdAt: '2024-01-02' },
          ],
          loading: false,
          error: null,
        } as TodoState,
      };
      expect(selectPendingTodos(allDoneState)).toEqual([]);
    });
  });

  // ---- selectCompletedTodos ----
  describe('selectCompletedTodos', () => {
    it('deve retornar apenas tarefas concluídas', () => {
      const result = selectCompletedTodos(mockState);
      expect(result.length).toBe(2);
      result.forEach((todo) => expect(todo.completed).toBe(true));
    });
  });

  // ---- selectTodosLoading ----
  describe('selectTodosLoading', () => {
    it('deve retornar false quando não está carregando', () => {
      expect(selectTodosLoading(mockState)).toBe(false);
    });

    it('deve retornar true quando está carregando', () => {
      const loadingState = { todos: { ...mockState.todos, loading: true } };
      expect(selectTodosLoading(loadingState)).toBe(true);
    });
  });

  // ---- selectTodosError ----
  describe('selectTodosError', () => {
    it('deve retornar null quando não há erro', () => {
      expect(selectTodosError(mockState)).toBeNull();
    });

    it('deve retornar a mensagem de erro quando há falha', () => {
      const errorState = { todos: { ...mockState.todos, error: 'Erro de rede' } };
      expect(selectTodosError(errorState)).toBe('Erro de rede');
    });
  });

  // ---- selectTodosStats ----
  describe('selectTodosStats', () => {
    it('deve calcular as estatísticas corretamente', () => {
      const stats = selectTodosStats(mockState);
      expect(stats.total).toBe(4);
      expect(stats.pending).toBe(2);
      expect(stats.completed).toBe(2);
    });

    it('deve retornar zeros para estado vazio', () => {
      const emptyState = { todos: { todos: [], loading: false, error: null } };
      const stats = selectTodosStats(emptyState);
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.completed).toBe(0);
    });
  });
});
