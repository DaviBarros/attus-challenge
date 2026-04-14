# 4 — Aplicação de Usuários

Aplicação Angular completa com listagem de usuários, modal de cadastro/edição, formulário reativo com validações, operadores RxJS e testes unitários.

## Estrutura

```
src/app/users/
├── user.model.ts                              # Interfaces User e UserFormData
├── services/
│   ├── user.service.ts                        # Serviço com dados mockados + RxJS
│   └── user.service.spec.ts                   # 15 testes do serviço
├── validators/
│   ├── user.validators.ts                     # cpfValidator, phoneValidator, máscaras
│   └── user.validators.spec.ts                # 22 testes dos validadores
└── components/
    ├── user-list/
    │   └── user-list.component.ts             # Listagem com filtro + debounce
    └── user-form-modal/
        ├── user-form-modal.component.ts        # Modal com formulário reativo
        └── user-form-modal.component.spec.ts   # 22 testes do formulário
```

## Funcionalidades

### Tela de Listagem
- Cards com nome, e-mail, CPF, telefone e botão de editar
- Filtro por nome com **debounce de 300ms**
- Estado de loading durante o carregamento
- Mensagem de erro em caso de falha
- Dados mockados via array estático no `UserService`

### Modal de Cadastro/Edição
- Formulário reativo com campos: **e-mail, nome, CPF, telefone e tipo de telefone**
- Todos os campos obrigatórios com mensagens de erro individuais
- Botão salvar **desabilitado** enquanto o formulário for inválido
- Preenchimento automático ao abrir em modo de edição

### Validações
- E-mail válido via `Validators.email`
- CPF com validação dos dígitos verificadores (`cpfValidator`)
- Telefone com máscara e validação de formato (`phoneValidator`)

## Operadores RxJS Utilizados

| Operador | Onde | Finalidade |
|---|---|---|
| `debounceTime(300)` | `user-list.component.ts` | Aguarda 300ms antes de buscar |
| `switchMap` | `user-list.component.ts` | Cancela requisições anteriores |
| `catchError` | `user-list.component.ts` | Trata erros sem quebrar o stream |
| `distinctUntilChanged` | `user-list.component.ts` | Evita buscas duplicadas |
| `tap` | `user.service.ts` | Log e efeitos colaterais |
| `map` | `user.service.ts` | Transformação de dados |

## Gerenciamento de Subscriptions

- `takeUntil(destroy$)` em todos os componentes
- `async pipe` nos templates para subscriptions automáticas

## Testes

```bash
npm install
npm test        # Executa os 59 testes (service + validators + form)
npm run test:coverage
```

| Suíte | Testes |
|---|---|
| `user.service.spec.ts` | 15 |
| `user.validators.spec.ts` | 22 |
| `user-form-modal.component.spec.ts` | 22 |
| **Total** | **59** |

## Como Executar

```bash
npm install
npm start       # http://localhost:4200
```
