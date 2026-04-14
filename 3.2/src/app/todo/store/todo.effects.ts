import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TodoService } from '../todo.service';
import { loadTodos, loadTodosSuccess, loadTodosError } from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly todoService: TodoService
  ) {}

  /**
   * Effect que gerencia o fluxo assíncrono de carregamento de todos.
   * Ao disparar loadTodos, realiza chamada HTTP (mockada) e despacha
   * loadTodosSuccess ou loadTodosError conforme o resultado.
   */
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      switchMap(() =>
        this.todoService.getTodos().pipe(
          map((todos) => loadTodosSuccess({ todos })),
          catchError((error: unknown) => {
            const message =
              error instanceof Error ? error.message : 'Erro ao carregar tarefas';
            return of(loadTodosError({ error: message }));
          })
        )
      )
    )
  );
}
