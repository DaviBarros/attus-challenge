# 3.2 — To-do List com NgRx

Implementação da estrutura de estado completa para uma lista de tarefas utilizando **NgRx** (Angular 17+).

## Estrutura

```
src/app/todo/
├── todo.model.ts                  # Interfaces Todo e TodoState
├── todo.service.ts                # Serviço com dados mockados
├── todo.service.spec.ts           # Testes do serviço
├── todo.component.ts              # Componente com Store e Selectors
└── store/
    ├── todo.actions.ts            # Actions NgRx
    ├── todo.reducer.ts            # Reducer com tipagem forte
    ├── todo.reducer.spec.ts       # 13 testes do Reducer
    ├── todo.selectors.ts          # Selectors NgRx
    ├── todo.selectors.spec.ts     # 11 testes dos Selectors
    └── todo.effects.ts            # Effect com switchMap + catchError
```

## Actions Implementadas

```typescript
loadTodos           // Inicia o carregamento da lista
loadTodosSuccess    // Recebe os todos com sucesso { todos: Todo[] }
loadTodosError      // Trata erro de carregamento { error: string }
toggleTodoComplete  // Alterna o status de conclusão { id: number }
```

## Selectors

```typescript
selectAllTodos      // Retorna a lista completa de todos
selectPendingTodos  // Retorna apenas as tarefas não concluídas
```

## Effect

```typescript
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    switchMap(() =>
      this.todoService.getTodos().pipe(
        map(todos => TodoActions.loadTodosSuccess({ todos })),
        catchError(error => of(TodoActions.loadTodosError({ error: error.message })))
      )
    )
  )
);
```

## Como Executar

```bash
npm install
npm start       # http://localhost:4200
npm test        # Executa os 17 testes (reducer + selectors + service)
```
