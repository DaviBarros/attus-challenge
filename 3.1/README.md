# 3.1 — Carrinho de Compras com Angular Signals

Implementação do componente de carrinho utilizando exclusivamente **Angular Signals** (Angular 17+).

## Estrutura

```
src/app/cart/
├── cart.model.ts              # Interfaces CartItem e CartProduct
├── cart.component.ts          # Componente com signal, computed e output
└── cart.component.spec.ts     # 17 testes unitários
```

## Conceitos Demonstrados

| Recurso | Implementação |
|---|---|
| `signal<CartItem[]>([])` | Lista reativa de itens do carrinho |
| `computed(() => ...)` | Total (quantidade × preço) e totalQuantity |
| `output<number>()` | Emite evento a cada mudança de total via `effect()` |
| `effect()` | Observa mudanças no `total` e dispara o `output` |

## Implementação

```typescript
// Signal para a lista de itens
items = signal<CartItem[]>([]);

// Computed para o total (quantidade × preço)
total = computed(() =>
  this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Computed para quantidade total de unidades
totalQuantity = computed(() =>
  this.items().reduce((sum, item) => sum + item.quantity, 0)
);

// output() que emite sempre que o total mudar
totalChange = output<number>();
```

## Como Executar

```bash
npm install
npm start       # http://localhost:4200
npm test        # Executa os 17 testes unitários
```
