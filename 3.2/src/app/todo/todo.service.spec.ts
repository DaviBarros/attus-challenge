import { describe, it, expect, beforeEach } from 'vitest';
import { TodoService } from './todo.service';
import { HttpClient } from '@angular/common/http';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService(null as unknown as HttpClient);
  });

  it('deve ser criado', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar um Observable com a lista de todos', (done) => {
    service.getTodos().subscribe((todos) => {
      expect(todos).toBeDefined();
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
      done();
    });
  });

  it('cada todo deve ter os campos obrigatórios', (done) => {
    service.getTodos().subscribe((todos) => {
      todos.forEach((todo) => {
        expect(todo.id).toBeDefined();
        expect(todo.title).toBeDefined();
        expect(typeof todo.completed).toBe('boolean');
        expect(todo.createdAt).toBeDefined();
      });
      done();
    });
  });

  it('deve conter tarefas concluídas e pendentes', (done) => {
    service.getTodos().subscribe((todos) => {
      const completed = todos.filter((t) => t.completed);
      const pending = todos.filter((t) => !t.completed);
      expect(completed.length).toBeGreaterThan(0);
      expect(pending.length).toBeGreaterThan(0);
      done();
    });
  });
});
