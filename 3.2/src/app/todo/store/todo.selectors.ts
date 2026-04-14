import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../todo.model';

// ---- Feature Selector ----
export const selectTodoState = createFeatureSelector<TodoState>('todos');

// ---- selectAllTodos: retorna a lista completa ----
export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

// ---- selectPendingTodos: retorna apenas as tarefas não concluídas ----
export const selectPendingTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => !todo.completed)
);

// ---- selectCompletedTodos: retorna apenas as tarefas concluídas ----
export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => todo.completed)
);

// ---- selectTodosLoading ----
export const selectTodosLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.loading
);

// ---- selectTodosError ----
export const selectTodosError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);

// ---- selectTodosStats ----
export const selectTodosStats = createSelector(
  selectAllTodos,
  selectPendingTodos,
  (all, pending) => ({
    total: all.length,
    pending: pending.length,
    completed: all.length - pending.length,
  })
);
