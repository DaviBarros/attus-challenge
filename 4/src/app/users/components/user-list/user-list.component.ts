import {
  Component,
  OnInit,
  OnDestroy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import {
  Subject,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  takeUntil,
  tap,
  startWith,
  map,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../../user.model';
import { UserService } from '../../services/user.service';
import {
  UserFormModalComponent,
  UserFormModalData,
} from '../user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div>
          <p class="section-subtitle">Tópico 4 — Aplicação Prática</p>
          <h1 class="section-title">Gerenciamento de Usuários</h1>
        </div>
        <div class="header-stats">
          <div class="stat-pill">
            <mat-icon>people</mat-icon>
            <span>{{ totalUsers() }} usuários</span>
          </div>
        </div>
      </div>

      <!-- Search & Actions Bar -->
      <div class="toolbar animate-fade-in-up" style="animation-delay: .1s">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por nome</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input
            matInput
            [formControl]="searchControl"
            placeholder="Digite o nome do usuário..."
            autocomplete="off"
          />
          @if (searchControl.value) {
            <button matSuffix mat-icon-button (click)="clearSearch()">
              <mat-icon>close</mat-icon>
            </button>
          }
          <mat-hint>Filtro com debounce de 300ms</mat-hint>
        </mat-form-field>

        <button
          mat-raised-button
          color="accent"
          class="new-user-btn"
          (click)="openCreateModal()"
          matTooltip="Cadastrar novo usuário"
        >
          <mat-icon>person_add</mat-icon>
          Novo Usuário
        </button>
      </div>

      <!-- Loading State -->
      @if (loading$ | async) {
        <div class="loading-state animate-fade-in">
          <div class="loading-card">
            <mat-spinner diameter="36" />
            <div>
              <p class="loading-title">Carregando usuários...</p>
              <p class="loading-sub">Aguarde um momento</p>
            </div>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error$ | async; as error) {
        <div class="error-banner animate-fade-in">
          <mat-icon>error_outline</mat-icon>
          <div class="error-content">
            <strong>Erro ao carregar usuários</strong>
            <span>{{ error }}</span>
          </div>
          <button mat-stroked-button (click)="reload()">
            <mat-icon>refresh</mat-icon>
            Tentar novamente
          </button>
        </div>
      }

      <!-- Users Grid -->
      @if (!(loading$ | async) && !(error$ | async)) {
        @if ((filteredUsers$ | async)?.length === 0 && !loading$.value) {
          <div class="empty-state animate-fade-in">
            <mat-icon>person_search</mat-icon>
            <h3>Nenhum usuário encontrado</h3>
            <p>
              @if (searchControl.value) {
                Nenhum resultado para "{{ searchControl.value }}"
              } @else {
                Cadastre o primeiro usuário clicando em "Novo Usuário"
              }
            </p>
            @if (searchControl.value) {
              <button mat-stroked-button (click)="clearSearch()">Limpar busca</button>
            }
          </div>
        }

        <div class="users-grid animate-fade-in-up" style="animation-delay: .2s">
          @for (user of filteredUsers$ | async; track user.id) {
            <div class="user-card animate-fade-in-up">
              <!-- Card Header -->
              <div class="card-header">
                <div class="user-avatar">
                  {{ getInitials(user.name) }}
                </div>
                <div class="user-primary">
                  <h3 class="user-name">{{ user.name }}</h3>
                  <span class="user-id">#{{ user.id }}</span>
                </div>
                <button
                  mat-icon-button
                  class="edit-btn"
                  (click)="openEditModal(user)"
                  matTooltip="Editar usuário"
                >
                  <mat-icon>edit</mat-icon>
                </button>
              </div>

              <mat-divider class="card-divider" />

              <!-- Card Body -->
              <div class="card-body">
                <div class="info-row">
                  <mat-icon class="info-icon">email</mat-icon>
                  <span class="info-text" [title]="user.email">{{ user.email }}</span>
                </div>
                <div class="info-row">
                  <mat-icon class="info-icon">badge</mat-icon>
                  <span class="info-text">{{ formatCpf(user.cpf) }}</span>
                </div>
                <div class="info-row">
                  <mat-icon class="info-icon">phone</mat-icon>
                  <span class="info-text">{{ user.phone }}</span>
                  <span class="phone-type-chip" [class]="'type-' + user.phoneType">
                    {{ user.phoneType }}
                  </span>
                </div>
                <div class="info-row">
                  <mat-icon class="info-icon">calendar_today</mat-icon>
                  <span class="info-text">Cadastrado em {{ user.createdAt }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- FAB Button -->
    <button
      mat-fab
      color="accent"
      class="fab-btn"
      (click)="openCreateModal()"
      matTooltip="Novo usuário"
      matTooltipPosition="left"
    >
      <mat-icon>add</mat-icon>
    </button>
  `,
  styles: [`
    :host { display: block; position: relative; }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-stats {
      display: flex;
      gap: 12px;
      align-self: flex-end;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 50px;
      font-size: .85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      box-shadow: var(--shadow-sm);

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--color-primary); }
    }

    // Toolbar
    .toolbar {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 280px;
    }

    .new-user-btn {
      height: 56px;
      padding: 0 24px;
      white-space: nowrap;
    }

    // Loading
    .loading-state {
      display: flex;
      justify-content: center;
      padding: 48px 24px;
    }

    .loading-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px 32px;
      background: var(--color-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
    }

    .loading-title {
      font-size: .95rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 4px;
    }

    .loading-sub {
      font-size: .8rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    // Error
    .error-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: rgba(239, 68, 68, .05);
      border: 1px solid rgba(239, 68, 68, .2);
      border-radius: var(--radius-lg);
      margin-bottom: 24px;

      mat-icon { color: var(--color-error); font-size: 28px; width: 28px; height: 28px; flex-shrink: 0; }
    }

    .error-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong { font-size: .9rem; color: var(--color-error); }
      span   { font-size: .82rem; color: var(--color-text-secondary); }
    }

    // Users Grid
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .user-card {
      background: var(--color-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: var(--transition);

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-3px);
        border-color: var(--color-primary-light);
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 20px 16px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .95rem;
      font-weight: 700;
      flex-shrink: 0;
      letter-spacing: .5px;
      box-shadow: 0 3px 8px rgba(57, 73, 171, .3);
    }

    .user-primary {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: .95rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-id {
      font-size: .75rem;
      color: var(--color-text-muted);
      font-family: 'Courier New', monospace;
    }

    .edit-btn {
      color: var(--color-primary) !important;
      opacity: .7;
      transition: var(--transition);

      &:hover { opacity: 1; background: rgba(57, 73, 171, .08) !important; }
    }

    .card-divider { margin: 0; }

    .card-body {
      padding: 16px 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .info-text {
      font-size: .85rem;
      color: var(--color-text-secondary);
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .phone-type-chip {
      font-size: .7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 20px;
      text-transform: capitalize;
      flex-shrink: 0;

      &.type-celular    { background: rgba(57, 73, 171, .1);  color: var(--color-primary); }
      &.type-residencial { background: rgba(16, 185, 129, .1); color: var(--color-success); }
      &.type-comercial  { background: rgba(245, 158, 11, .1); color: var(--color-warning); }
    }

    // FAB
    .fab-btn {
      position: fixed !important;
      bottom: 32px;
      right: 32px;
      z-index: 200;
      box-shadow: 0 6px 20px rgba(233, 30, 99, .4) !important;
      transition: var(--transition) !important;

      &:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 8px 28px rgba(233, 30, 99, .5) !important;
      }
    }
  `],
})
export class UserListComponent implements OnInit, OnDestroy {
  readonly searchControl = new FormControl('');

  // BehaviorSubjects para loading e error
  readonly loading$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string | null>(null);

  // Signal derivado para contagem de usuários com Angular Signals
  readonly totalUsers = computed(() => this.userService.usersState().length);

  // Observable de usuários filtrados
  filteredUsers$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.loading$.next(true);
      this.error$.next(null);
    }),
    switchMap((term) =>
      this.userService.searchUsers(term ?? '').pipe(
        catchError((err: Error) => {
          this.error$.next(err.message);
          return of([]);
        })
      )
    ),
    tap(() => this.loading$.next(false)),
    map((users) => users)
  );

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Trigger inicial para carregar todos os usuários
    this.searchControl.setValue('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reload(): void {
    this.searchControl.setValue(this.searchControl.value ?? '');
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(UserFormModalComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: { mode: 'create' } as UserFormModalData,
      panelClass: 'attus-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result?.success) {
          this.reload();
          this.snackBar.open('Usuário cadastrado com sucesso!', 'OK', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
        }
      });
  }

  openEditModal(user: User): void {
    const dialogRef = this.dialog.open(UserFormModalComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: { mode: 'edit', user } as UserFormModalData,
      panelClass: 'attus-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result?.success) {
          this.reload();
          this.snackBar.open('Usuário atualizado com sucesso!', 'OK', {
            duration: 3000,
            panelClass: ['snack-success'],
          });
        }
      });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join('');
  }

  formatCpf(cpf: string): string {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
}
