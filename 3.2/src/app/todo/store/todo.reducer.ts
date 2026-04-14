import { createReducer, on } from '@ngrx/store';
import { TodoState } from '../todo.model';
import {
  loadTodos,
  loadTodosSuccess,
  loadTodosError,
  toggleTodoComplete,
} from './todo.actions';

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,

  // ---- loadTodos: inicia o carregamento ----
  on(loadTodos, (state): TodoState => ({
    ...state,
    loading: true,
    error: null,
  })),

  // ---- loadTodosSuccess: armazena os todos carregados ----
  on(loadTodosSuccess, (state, { todos }): TodoState => ({
    ...state,
    todos,
    loading: false,
    error: null,
  })),

  // ---- loadTodosError: armazena a mensagem de erro ----
  on(loadTodosError, (state, { error }): TodoState => ({
    ...state,
    loading: false,
    error,
  })),

  // ---- toggleTodoComplete: alterna o estado de conclusão ----
  on(toggleTodoComplete, (state, { id }): TodoState => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  }))
);
