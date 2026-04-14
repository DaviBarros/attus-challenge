import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User, UserFormData, PhoneType } from '../../user.model';
import { UserService } from '../../services/user.service';
import { cpfValidator, phoneValidator, applyCpfMask, applyPhoneMask } from '../../validators/user.validators';

export interface UserFormModalData {
  user?: User;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="modal-icon" [class.edit-mode]="isEditMode">
            <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
          </div>
          <div>
            <h2 class="modal-title">
              {{ isEditMode ? 'Editar Usuário' : 'Novo Usuário' }}
            </h2>
            <p class="modal-subtitle">
              {{ isEditMode ? 'Atualize os dados do usuário' : 'Preencha os dados para cadastrar' }}
            </p>
          </div>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-form">
        <div class="form-grid">
          <!-- Nome -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome completo</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input
              matInput
              formControlName="name"
              placeholder="Ex: João da Silva"
              autocomplete="name"
            />
            @if (f['name'].invalid && f['name'].touched) {
              <mat-error>
                @if (f['name'].errors?.['required']) { Nome é obrigatório }
                @if (f['name'].errors?.['minlength']) { Nome deve ter pelo menos 3 caracteres }
              </mat-error>
            }
          </mat-form-field>

          <!-- E-mail -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>E-mail</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input
              matInput
              formControlName="email"
              type="email"
              placeholder="Ex: joao@email.com"
              autocomplete="email"
            />
            @if (f['email'].invalid && f['email'].touched) {
              <mat-error>
                @if (f['email'].errors?.['required']) { E-mail é obrigatório }
                @if (f['email'].errors?.['email']) { Informe um e-mail válido }
              </mat-error>
            }
          </mat-form-field>

          <!-- CPF -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>CPF</mat-label>
            <mat-icon matPrefix>badge</mat-icon>
            <input
              matInput
              formControlName="cpf"
              placeholder="000.000.000-00"
              maxlength="14"
              (input)="onCpfInput($event)"
            />
            @if (f['cpf'].invalid && f['cpf'].touched) {
              <mat-error>
                @if (f['cpf'].errors?.['required']) { CPF é obrigatório }
                @if (f['cpf'].errors?.['cpfInvalid']) {
                  {{ f['cpf'].errors?.['cpfInvalid'].message }}
                }
              </mat-error>
            }
          </mat-form-field>

          <!-- Telefone + Tipo -->
          <div class="phone-row">
            <mat-form-field appearance="outline" class="phone-field">
              <mat-label>Telefone</mat-label>
              <mat-icon matPrefix>phone</mat-icon>
              <input
                matInput
                formControlName="phone"
                placeholder="(00) 00000-0000"
                maxlength="15"
                (input)="onPhoneInput($event)"
              />
              @if (f['phone'].invalid && f['phone'].touched) {
                <mat-error>
                  @if (f['phone'].errors?.['required']) { Telefone é obrigatório }
                  @if (f['phone'].errors?.['phoneInvalid']) {
                    {{ f['phone'].errors?.['phoneInvalid'].message }}
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="phone-type-field">
              <mat-label>Tipo</mat-label>
              <mat-icon matPrefix>category</mat-icon>
              <mat-select formControlName="phoneType">
                <mat-option value="celular">
                  <mat-icon>smartphone</mat-icon> Celular
                </mat-option>
                <mat-option value="residencial">
                  <mat-icon>home</mat-icon> Residencial
                </mat-option>
                <mat-option value="comercial">
                  <mat-icon>business</mat-icon> Comercial
                </mat-option>
              </mat-select>
              @if (f['phoneType'].invalid && f['phoneType'].touched) {
                <mat-error>Tipo de telefone é obrigatório</mat-error>
              }
            </mat-form-field>
          </div>
        </div>

        <!-- Form Status Indicator -->
        <div class="form-status" [class.valid]="form.valid" [class.invalid]="form.invalid && form.touched">
          <mat-icon>{{ form.valid ? 'check_circle' : 'info' }}</mat-icon>
          <span>{{ form.valid ? 'Formulário válido — pronto para salvar' : 'Preencha todos os campos obrigatórios' }}</span>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            type="button"
            mat-stroked-button
            (click)="onCancel()"
            [disabled]="saving"
          >
            Cancelar
          </button>
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="form.invalid || saving"
            class="save-btn"
          >
            @if (saving) {
              <mat-spinner diameter="18" />
              Salvando...
            } @else {
              <mat-icon>{{ isEditMode ? 'save' : 'person_add' }}</mat-icon>
              {{ isEditMode ? 'Salvar alterações' : 'Cadastrar usuário' }}
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-container {
      width: 100%;
      max-width: 560px;
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 28px 28px 0;
      gap: 16px;
    }

    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .modal-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3949ab, #1a237e);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(57, 73, 171, .3);

      mat-icon { color: #fff; font-size: 24px; width: 24px; height: 24px; }

      &.edit-mode {
        background: linear-gradient(135deg, #e91e63, #c2185b);
        box-shadow: 0 4px 12px rgba(233, 30, 99, .3);
      }
    }

    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 4px;
    }

    .modal-subtitle {
      font-size: .85rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .close-btn {
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .modal-form {
      padding: 24px 28px 28px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .full-width { width: 100%; }

    .phone-row {
      display: grid;
      grid-template-columns: 1fr 160px;
      gap: 12px;
    }

    .phone-field { width: 100%; }
    .phone-type-field { width: 100%; }

    .form-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: .82rem;
      font-weight: 500;
      margin: 8px 0 20px;
      background: rgba(107, 114, 128, .08);
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
      transition: var(--transition);

      mat-icon { font-size: 16px; width: 16px; height: 16px; }

      &.valid {
        background: rgba(16, 185, 129, .08);
        color: var(--color-success);
        border-color: rgba(16, 185, 129, .3);
      }

      &.invalid {
        background: rgba(245, 158, 11, .08);
        color: var(--color-warning);
        border-color: rgba(245, 158, 11, .3);
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .save-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 160px;
      justify-content: center;

      mat-spinner { display: inline-block; }
    }

    // Material overrides
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      margin-top: 2px;
    }
  `],
})
export class UserFormModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  saving = false;
  isEditMode: boolean;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly dialogRef: MatDialogRef<UserFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: UserFormModalData
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.buildForm();

    // Preenche automaticamente ao editar
    if (this.isEditMode && this.data.user) {
      this.form.patchValue({
        name: this.data.user.name,
        email: this.data.user.email,
        cpf: this.data.user.cpf,
        phone: this.data.user.phone,
        phoneType: this.data.user.phoneType,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, cpfValidator()]],
      phone: ['', [Validators.required, phoneValidator()]],
      phoneType: ['celular' as PhoneType, Validators.required],
    });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = applyCpfMask(input.value);
    this.form.get('cpf')?.setValue(masked, { emitEvent: false });
    input.value = masked;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = applyPhoneMask(input.value);
    this.form.get('phone')?.setValue(masked, { emitEvent: false });
    input.value = masked;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formData: UserFormData = this.form.value;

    const operation$ = this.isEditMode && this.data.user
      ? this.userService.updateUser(this.data.user.id, formData)
      : this.userService.createUser(formData);

    operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.saving = false;
          this.dialogRef.close({ success: true, user });
        },
        error: () => {
          this.saving = false;
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
