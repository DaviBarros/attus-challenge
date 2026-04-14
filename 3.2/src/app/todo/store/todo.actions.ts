import { createAction } from '@ngrx/store';
import { Todo } from '../todo.model';

// ---- Load Todos ----
export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  (payload: { todos: Todo[] }) => payload
);

export const loadTodosError = createAction(
  '[Todo] Load Todos Error',
  (payload: { error: string }) => payload
);

// ---- Toggle Complete ----
export const toggleTodoComplete = createAction(
  '[Todo] Toggle Todo Complete',
  (payload: { id: number }) => payload
);
