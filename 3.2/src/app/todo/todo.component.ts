import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';
import {
  loadTodos,
  toggleTodoComplete,
} from './store/todo.actions';
import {
  selectAllTodos,
  selectPendingTodos,
  selectCompletedTodos,
  selectTodosLoading,
  selectTodosError,
  selectTodosStats,
} from './store/todo.selectors';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div>
          <p class="section-subtitle">Tópico 3.2 — NgRx Store</p>
          <h1 class="section-title">To-do List</h1>
        </div>
        <button
          mat-raised-button
          color="primary"
          (click)="loadTodos()"
          [disabled]="loading$ | async"
          class="reload-btn"
        >
          <mat-icon>refresh</mat-icon>
          Recarregar
        </button>
      </div>

      <!-- Stats Cards -->
      @if (stats$ | async; as stats) {
        <div class="stats-grid animate-fade-in-up" style="animation-delay: .1s">
          <div class="stat-card">
            <div class="stat-icon total">
              <mat-icon>list_alt</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.total }}</span>
              <span class="stat-label">Total de Tarefas</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.pending }}</span>
              <span class="stat-label">Pendentes</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon completed">
              <mat-icon>task_alt</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.completed }}</span>
              <span class="stat-label">Concluídas</span>
            </div>
          </div>
          @if (stats.total > 0) {
            <div class="stat-card progress-card">
              <div class="progress-label">
                <span>Progresso</span>
                <span class="progress-pct">{{ (stats.completed / stats.total * 100) | number:'1.0-0' }}%</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  [style.width.%]="stats.completed / stats.total * 100"
                ></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Loading State -->
      @if (loading$ | async) {
        <div class="loading-state animate-fade-in">
          <mat-spinner diameter="40" />
          <p>Carregando tarefas via NgRx Effect...</p>
        </div>
      }

      <!-- Error State -->
      @if (error$ | async; as error) {
        <div class="error-state animate-fade-in">
          <mat-icon>error_outline</mat-icon>
          <div>
            <h4>Erro ao carregar tarefas</h4>
            <p>{{ error }}</p>
          </div>
          <button mat-stroked-button (click)="loadTodos()">Tentar novamente</button>
        </div>
      }

      <!-- Tabs -->
      @if (!(loading$ | async) && !(error$ | async)) {
        <mat-tab-group class="todo-tabs animate-fade-in-up" style="animation-delay: .2s">
          <!-- All Todos -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">list</mat-icon>
              Todas
            </ng-template>
            <div class="tab-content">
              @if ((allTodos$ | async)?.length === 0) {
                <div class="empty-state">
                  <mat-icon>checklist</mat-icon>
                  <h3>Nenhuma tarefa encontrada</h3>
                  <p>Clique em "Recarregar" para buscar as tarefas</p>
                </div>
              }
              @for (todo of allTodos$ | async; track todo.id) {
                <div class="todo-item" [class.completed]="todo.completed">
                  <mat-checkbox
                    [checked]="todo.completed"
                    (change)="toggleTodo(todo.id)"
                    color="primary"
                  />
                  <div class="todo-content">
                    <span class="todo-title">{{ todo.title }}</span>
                    <span class="todo-date">{{ todo.createdAt }}</span>
                  </div>
                  <span class="todo-status" [class.done]="todo.completed">
                    {{ todo.completed ? 'Concluída' : 'Pendente' }}
                  </span>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Pending Todos -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">pending</mat-icon>
              Pendentes
            </ng-template>
            <div class="tab-content">
              @if ((pendingTodos$ | async)?.length === 0) {
                <div class="empty-state">
                  <mat-icon>celebration</mat-icon>
                  <h3>Tudo concluído!</h3>
                  <p>Não há tarefas pendentes</p>
                </div>
              }
              @for (todo of pendingTodos$ | async; track todo.id) {
                <div class="todo-item">
                  <mat-checkbox
                    [checked]="false"
                    (change)="toggleTodo(todo.id)"
                    color="primary"
                  />
                  <div class="todo-content">
                    <span class="todo-title">{{ todo.title }}</span>
                    <span class="todo-date">{{ todo.createdAt }}</span>
                  </div>
                  <span class="todo-status">Pendente</span>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Completed Todos -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">done_all</mat-icon>
              Concluídas
            </ng-template>
            <div class="tab-content">
              @if ((completedTodos$ | async)?.length === 0) {
                <div class="empty-state">
                  <mat-icon>task_alt</mat-icon>
                  <h3>Nenhuma tarefa concluída</h3>
                  <p>Marque tarefas como concluídas para vê-las aqui</p>
                </div>
              }
              @for (todo of completedTodos$ | async; track todo.id) {
                <div class="todo-item completed">
                  <mat-checkbox
                    [checked]="true"
                    (change)="toggleTodo(todo.id)"
                    color="primary"
                  />
                  <div class="todo-content">
                    <span class="todo-title">{{ todo.title }}</span>
                    <span class="todo-date">{{ todo.createdAt }}</span>
                  </div>
                  <span class="todo-status done">Concluída</span>
                </div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }

      <!-- NgRx Info Panel -->
      <div class="ngrx-info animate-fade-in-up" style="animation-delay: .3s">
        <h3 class="info-title">
          <mat-icon>info_outline</mat-icon>
          Estrutura NgRx implementada
        </h3>
        <div class="ngrx-grid">
          <div class="ngrx-item">
            <span class="ngrx-label">Actions</span>
            <span class="ngrx-value">loadTodos · loadTodosSuccess · loadTodosError · toggleTodoComplete</span>
          </div>
          <div class="ngrx-item">
            <span class="ngrx-label">Reducer</span>
            <span class="ngrx-value">createReducer com tipagem forte (TodoState)</span>
          </div>
          <div class="ngrx-item">
            <span class="ngrx-label">Selectors</span>
            <span class="ngrx-value">selectAllTodos · selectPendingTodos · selectCompletedTodos · selectTodosStats</span>
          </div>
          <div class="ngrx-item">
            <span class="ngrx-label">Effects</span>
            <span class="ngrx-value">loadTodos$ com switchMap + catchError + HTTP mockado</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .reload-btn {
      align-self: flex-end;
    }

    // Stats
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--color-card);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      transition: var(--transition);

      &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon { font-size: 24px; width: 24px; height: 24px; color: #fff; }

      &.total { background: linear-gradient(135deg, #3949ab, #1a237e); }
      &.pending { background: linear-gradient(135deg, #f59e0b, #d97706); }
      &.completed { background: linear-gradient(135deg, #10b981, #059669); }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--color-text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: .8rem;
      color: var(--color-text-muted);
      margin-top: 4px;
    }

    .progress-card {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      grid-column: span 1;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: .85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    .progress-pct { color: var(--color-primary); }

    .progress-bar {
      height: 8px;
      background: var(--color-border);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      border-radius: 4px;
      transition: width .5s ease;
    }

    // Loading / Error
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px;
      text-align: center;
      color: var(--color-text-secondary);
    }

    .error-state {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: rgba(239, 68, 68, .05);
      border: 1px solid rgba(239, 68, 68, .2);
      border-radius: var(--radius-lg);
      margin-bottom: 24px;

      mat-icon { color: var(--color-error); font-size: 28px; width: 28px; height: 28px; flex-shrink: 0; }

      h4 { margin: 0 0 4px; font-size: .95rem; color: var(--color-error); }
      p  { margin: 0; font-size: .85rem; color: var(--color-text-secondary); }

      button { margin-left: auto; white-space: nowrap; }
    }

    // Tabs
    .todo-tabs {
      background: var(--color-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .tab-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 6px;
      vertical-align: middle;
    }

    .tab-content {
      padding: 16px 24px 24px;
      min-height: 200px;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      margin-bottom: 8px;
      transition: var(--transition);
      background: var(--color-background);

      &:hover { border-color: var(--color-primary-light); box-shadow: var(--shadow-sm); }

      &.completed {
        opacity: .65;
        background: rgba(16, 185, 129, .03);
        border-color: rgba(16, 185, 129, .2);

        .todo-title { text-decoration: line-through; color: var(--color-text-muted); }
      }
    }

    .todo-content {
      flex: 1;
      min-width: 0;
    }

    .todo-title {
      display: block;
      font-size: .9rem;
      font-weight: 500;
      color: var(--color-text-primary);
      margin-bottom: 2px;
    }

    .todo-date {
      font-size: .75rem;
      color: var(--color-text-muted);
    }

    .todo-status {
      font-size: .75rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      background: rgba(245, 158, 11, .1);
      color: var(--color-warning);
      white-space: nowrap;

      &.done {
        background: rgba(16, 185, 129, .1);
        color: var(--color-success);
      }
    }

    // NgRx Info
    .ngrx-info {
      background: linear-gradient(135deg, rgba(57, 73, 171, .04) 0%, rgba(57, 73, 171, .08) 100%);
      border: 1px solid rgba(57, 73, 171, .2);
      border-radius: var(--radius-lg);
      padding: 24px;
    }

    .info-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: .95rem;
      font-weight: 600;
      color: var(--color-primary);
      margin: 0 0 16px;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    .ngrx-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 12px;
    }

    .ngrx-item {
      background: var(--color-card);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      border: 1px solid rgba(57, 73, 171, .15);
    }

    .ngrx-label {
      display: block;
      font-size: .7rem;
      font-weight: 700;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: .8px;
      margin-bottom: 4px;
      font-family: 'Courier New', monospace;
    }

    .ngrx-value {
      font-size: .82rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
    }
  `],
})
export class TodoComponent implements OnInit {
  readonly allTodos$: Observable<Todo[]>;
  readonly pendingTodos$: Observable<Todo[]>;
  readonly completedTodos$: Observable<Todo[]>;
  readonly loading$: Observable<boolean>;
  readonly error$: Observable<string | null>;
  readonly stats$: Observable<{ total: number; pending: number; completed: number }>;

  constructor(private readonly store: Store) {
    this.allTodos$ = this.store.select(selectAllTodos);
    this.pendingTodos$ = this.store.select(selectPendingTodos);
    this.completedTodos$ = this.store.select(selectCompletedTodos);
    this.loading$ = this.store.select(selectTodosLoading);
    this.error$ = this.store.select(selectTodosError);
    this.stats$ = this.store.select(selectTodosStats);
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.store.dispatch(loadTodos());
  }

  toggleTodo(id: number): void {
    this.store.dispatch(toggleTodoComplete({ id }));
  }
}
