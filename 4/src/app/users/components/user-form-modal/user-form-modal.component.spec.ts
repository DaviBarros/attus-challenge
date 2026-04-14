/// <reference types="vitest/globals" />
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { cpfValidator, phoneValidator } from '../../validators/user.validators';
import { User, UserFormData, PhoneType } from '../../user.model';
import { UserFormModalComponent, UserFormModalData } from './user-form-modal.component';

// Testes focados na lógica do formulário reativo sem TestBed
// Testamos: validações, preenchimento automático, estado do formulário

function buildForm(fb: FormBuilder) {
  return fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, cpfValidator()]],
    phone: ['', [Validators.required, phoneValidator()]],
    phoneType: ['celular' as PhoneType, Validators.required],
  });
}

const mockUser: User = {
  id: 1,
  name: 'João da Silva',
  email: 'joao@email.com',
  cpf: '529.982.247-25',
  phone: '(11) 98765-4321',
  phoneType: 'celular',
  createdAt: '2024-01-01',
};

describe('UserFormModal — Lógica do Formulário Reativo', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  // ---- Modo Criação ----
  describe('Modo de criação', () => {
    it('deve iniciar com formulário vazio', () => {
      const form = buildForm(fb);
      expect(form.get('name')?.value).toBe('');
      expect(form.get('email')?.value).toBe('');
      expect(form.get('cpf')?.value).toBe('');
      expect(form.get('phone')?.value).toBe('');
    });

    it('deve ter phoneType padrão "celular"', () => {
      const form = buildForm(fb);
      expect(form.get('phoneType')?.value).toBe('celular');
    });

    it('deve ser inválido quando todos os campos estão vazios', () => {
      const form = buildForm(fb);
      expect(form.invalid).toBe(true);
    });
  });

  // ---- Modo Edição ----
  describe('Modo de edição — patchValue', () => {
    it('deve preencher o formulário com os dados do usuário via patchValue', () => {
      const form = buildForm(fb);
      form.patchValue({
        name: mockUser.name,
        email: mockUser.email,
        cpf: mockUser.cpf,
        phone: mockUser.phone,
        phoneType: mockUser.phoneType,
      });
      expect(form.get('name')?.value).toBe(mockUser.name);
      expect(form.get('email')?.value).toBe(mockUser.email);
      expect(form.get('cpf')?.value).toBe(mockUser.cpf);
      expect(form.get('phone')?.value).toBe(mockUser.phone);
      expect(form.get('phoneType')?.value).toBe(mockUser.phoneType);
    });

    it('deve ser válido após preencher com dados corretos', () => {
      const form = buildForm(fb);
      form.patchValue({
        name: mockUser.name,
        email: mockUser.email,
        cpf: mockUser.cpf,
        phone: mockUser.phone,
        phoneType: mockUser.phoneType,
      });
      expect(form.valid).toBe(true);
    });
  });

  // ---- Validações ----
  describe('Validações do formulário', () => {
    it('deve validar campo nome como obrigatório', () => {
      const form = buildForm(fb);
      const nameControl = form.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      expect(nameControl?.errors?.['required']).toBeTruthy();
    });

    it('deve validar minlength do nome (mínimo 3 caracteres)', () => {
      const form = buildForm(fb);
      const nameControl = form.get('name');
      nameControl?.setValue('Jo');
      nameControl?.markAsTouched();
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
    });

    it('deve aceitar nome válido', () => {
      const form = buildForm(fb);
      const nameControl = form.get('name');
      nameControl?.setValue('João da Silva');
      expect(nameControl?.errors).toBeNull();
    });

    it('deve validar campo email como obrigatório', () => {
      const form = buildForm(fb);
      const emailControl = form.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('deve validar formato de email inválido', () => {
      const form = buildForm(fb);
      const emailControl = form.get('email');
      emailControl?.setValue('email-invalido');
      emailControl?.markAsTouched();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('deve aceitar email válido', () => {
      const form = buildForm(fb);
      const emailControl = form.get('email');
      emailControl?.setValue('valido@email.com');
      expect(emailControl?.errors).toBeNull();
    });

    it('deve validar CPF inválido (sequência repetida)', () => {
      const form = buildForm(fb);
      const cpfControl = form.get('cpf');
      cpfControl?.setValue('111.111.111-11');
      cpfControl?.markAsTouched();
      expect(cpfControl?.errors?.['cpfInvalid']).toBeDefined();
    });

    it('deve aceitar CPF válido', () => {
      const form = buildForm(fb);
      const cpfControl = form.get('cpf');
      cpfControl?.setValue('529.982.247-25');
      expect(cpfControl?.errors).toBeNull();
    });

    it('deve validar telefone inválido', () => {
      const form = buildForm(fb);
      const phoneControl = form.get('phone');
      phoneControl?.setValue('(11) 999');
      phoneControl?.markAsTouched();
      expect(phoneControl?.errors?.['phoneInvalid']).toBeDefined();
    });

    it('deve aceitar telefone válido', () => {
      const form = buildForm(fb);
      const phoneControl = form.get('phone');
      phoneControl?.setValue('(11) 98765-4321');
      expect(phoneControl?.errors).toBeNull();
    });

    it('deve validar phoneType como obrigatório', () => {
      const form = buildForm(fb);
      const phoneTypeControl = form.get('phoneType');
      phoneTypeControl?.setValue(null);
      phoneTypeControl?.markAsTouched();
      expect(phoneTypeControl?.errors?.['required']).toBeTruthy();
    });

    it('deve ser válido com todos os campos corretos', () => {
      const form = buildForm(fb);
      form.setValue({
        name: 'João da Silva',
        email: 'joao@email.com',
        cpf: '529.982.247-25',
        phone: '(11) 98765-4321',
        phoneType: 'celular',
      });
      expect(form.valid).toBe(true);
    });

    it('botão salvar deve estar desabilitado quando formulário inválido', () => {
      const form = buildForm(fb);
      // Simula a condição: form.invalid || saving
      const saving = false;
      const buttonDisabled = form.invalid || saving;
      expect(buttonDisabled).toBe(true);
    });

    it('botão salvar deve estar habilitado quando formulário válido', () => {
      const form = buildForm(fb);
      form.setValue({
        name: 'João da Silva',
        email: 'joao@email.com',
        cpf: '529.982.247-25',
        phone: '(11) 98765-4321',
        phoneType: 'celular',
      });
      const saving = false;
      const buttonDisabled = form.invalid || saving;
      expect(buttonDisabled).toBe(false);
    });
  });

  // ---- Lógica de submissão ----
  describe('Lógica de submissão', () => {
    it('não deve submeter quando o formulário é inválido', () => {
      const form = buildForm(fb);
      const mockSave = vi.fn();

      if (form.invalid) {
        form.markAllAsTouched();
        // não chama save
      } else {
        mockSave(form.value);
      }

      expect(mockSave).not.toHaveBeenCalled();
    });

    it('deve submeter quando o formulário é válido', () => {
      const form = buildForm(fb);
      form.setValue({
        name: 'João da Silva',
        email: 'joao@email.com',
        cpf: '529.982.247-25',
        phone: '(11) 98765-4321',
        phoneType: 'celular',
      });

      const mockSave = vi.fn();

      if (form.invalid) {
        form.markAllAsTouched();
      } else {
        mockSave(form.value);
      }

      expect(mockSave).toHaveBeenCalledWith(form.value);
    });

    it('deve marcar todos os campos como touched ao tentar submeter inválido', () => {
      const form = buildForm(fb);
      form.markAllAsTouched();
      Object.values(form.controls).forEach((control) => {
        const c = control as AbstractControl;
        expect(c.touched).toBe(true);
      });
    });
  });
});

// ---- Testes adicionais cobrindo a classe UserFormModalComponent ----

describe('UserFormModalComponent (classe)', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  function createComponent(mode: 'create' | 'edit', user?: User) {
    const data: UserFormModalData = { mode, user };
    const mockService = {
      createUser: vi.fn(() => of(user ?? mockUser)),
      updateUser: vi.fn(() => of(user ?? mockUser)),
    } as any;
    const mockDialogRef = {
      close: vi.fn(),
    } as any;

    const component = new UserFormModalComponent(
      fb,
      mockService,
      mockDialogRef,
      data
    );

    component.ngOnInit();
    return { component, mockService, mockDialogRef };
  }

  it('deve preencher automaticamente os dados no modo edição', () => {
    const { component } = createComponent('edit', mockUser);
    expect(component.form.value.name).toBe(mockUser.name);
    expect(component.form.value.email).toBe(mockUser.email);
  });

  it('onCpfInput deve aplicar máscara de CPF', () => {
    const { component } = createComponent('create');
    const input = { value: '52998224725' } as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onCpfInput(event);

    expect(component.form.get('cpf')?.value).toBe('529.982.247-25');
  });

  it('onPhoneInput deve aplicar máscara de telefone', () => {
    const { component } = createComponent('create');
    const input = { value: '11987654321' } as HTMLInputElement;
    const event = { target: input } as unknown as Event;

    component.onPhoneInput(event);

    expect(component.form.get('phone')?.value).toContain('(11)');
  });

  it('deve chamar createUser e fechar o diálogo ao submeter criação válida', () => {
    const { component, mockService, mockDialogRef } = createComponent('create');

    component.form.setValue({
      name: mockUser.name,
      email: mockUser.email,
      cpf: '529.982.247-25',
      phone: mockUser.phone,
      phoneType: mockUser.phoneType,
    });

    component.onSubmit();

    expect(mockService.createUser).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ success: true, user: expect.any(Object) });
  });

  it('deve chamar updateUser ao submeter em modo edição', () => {
    const { component, mockService } = createComponent('edit', mockUser);

    component.form.setValue({
      name: mockUser.name,
      email: mockUser.email,
      cpf: '529.982.247-25',
      phone: mockUser.phone,
      phoneType: mockUser.phoneType,
    });

    component.onSubmit();

    expect(mockService.updateUser).toHaveBeenCalledWith(mockUser.id, expect.any(Object));
  });

  it('deve fechar o diálogo com success false ao cancelar', () => {
    const { component, mockDialogRef } = createComponent('create');
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ success: false });
  });

  it('ngOnDestroy deve completar o fluxo de destroy$', () => {
    const { component } = createComponent('create');
    // Apenas chamar para cobrir o método; não deve lançar erros
    component.ngOnDestroy();
  });
});
