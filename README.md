# Attus Frontend Challenge — Angular

Repositório de entrega do desafio técnico para Desenvolvedor Front End Angular da Attus.

---

## Estrutura do Repositório

```

│
├── 3.1/                    # Tópico 3.1 — Carrinho com Angular Signals
│   ├── src/app/cart/
│   │   ├── cart.model.ts
│   │   ├── cart.component.ts
│   │   └── cart.component.spec.ts
│   ├── package.json
│   └── README.md
│
├── 3.2/                    # Tópico 3.2 — To-do List com NgRx
│   ├── src/app/todo/
│   │   ├── todo.model.ts
│   │   ├── todo.service.ts
│   │   ├── todo.component.ts
│   │   └── store/
│   │       ├── todo.actions.ts
│   │       ├── todo.reducer.ts
│   │       ├── todo.selectors.ts
│   │       └── todo.effects.ts
│   ├── package.json
│   └── README.md
│
└── 4/                      # Tópico 4 — Aplicação Prática de Usuários
    ├── src/app/users/
    │   ├── user.model.ts
    │   ├── services/user.service.ts
    │   ├── validators/user.validators.ts
    │   └── components/
    │       ├── user-list/user-list.component.ts
    │       └── user-form-modal/user-form-modal.component.ts
    ├── package.json
    └── README.md
```

---



## Projetos de Código

### 3.1 — Angular Signals

```bash
cd 3.1
npm install
npm test    # testes passando
npm start   # http://localhost:4200
```

### 3.2 — NgRx To-do

```bash
cd 3.2
npm install
npm test    # testes passando (reducer + selectors + service)
npm start   # http://localhost:4200
```

### 4 — Aplicação de Usuários

```bash
cd 4
npm install
npm test    # testes passando
npm start   # http://localhost:4200
```

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Angular | 17.x |
| NgRx | 17.x |
| Angular Material | 17.x |
| RxJS | 7.x |
| Vitest | 1.x |
| TypeScript | 5.x |
