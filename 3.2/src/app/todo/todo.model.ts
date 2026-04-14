export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}
