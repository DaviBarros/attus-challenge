import {
  Component,
  signal,
  computed,
  output,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartItem, CartProduct } from './cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div>
          <p class="section-subtitle">Tópico 3.1 — Angular Signals</p>
          <h1 class="section-title">Carrinho de Compras</h1>
        </div>
        <div class="cart-summary-badge" [class.has-items]="items().length > 0">
          <mat-icon>shopping_cart</mat-icon>
          <span>{{ items().length }} {{ items().length === 1 ? 'item' : 'itens' }}</span>
        </div>
      </div>

      <div class="cart-layout">
        <!-- Products Catalog -->
        <section class="products-section animate-fade-in-up" style="animation-delay: .1s">
          <h2 class="subsection-title">
            <mat-icon>storefront</mat-icon>
            Catálogo de Produtos
          </h2>
          <div class="products-grid">
            @for (product of availableProducts; track product.id) {
              <div class="product-card">
                <div class="product-emoji">{{ product.imageUrl }}</div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-price">{{ product.price | currency:'BRL':'symbol':'1.2-2' }}</p>
                </div>
                <button
                  mat-raised-button
                  color="primary"
                  class="add-btn"
                  (click)="addItem(product)"
                >
                  <mat-icon>add_shopping_cart</mat-icon>
                  Adicionar
                </button>
              </div>
            }
          </div>
        </section>

        <!-- Cart Items -->
        <section class="cart-section animate-fade-in-up" style="animation-delay: .2s">
          <h2 class="subsection-title">
            <mat-icon>receipt_long</mat-icon>
            Meu Carrinho
          </h2>

          @if (items().length === 0) {
            <div class="empty-state">
              <mat-icon>remove_shopping_cart</mat-icon>
              <h3>Carrinho vazio</h3>
              <p>Adicione produtos do catálogo ao lado</p>
            </div>
          } @else {
            <div class="cart-items">
              @for (item of items(); track item.id) {
                <div class="cart-item animate-slide-in">
                  <div class="item-emoji">{{ item.imageUrl }}</div>
                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <p class="item-unit-price">{{ item.price | currency:'BRL':'symbol':'1.2-2' }} / un.</p>
                  </div>
                  <div class="quantity-controls">
                    <button
                      mat-icon-button
                      class="qty-btn"
                      (click)="decrementItem(item.id)"
                    >
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button
                      mat-icon-button
                      class="qty-btn"
                      (click)="incrementItem(item.id)"
                    >
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                  <div class="item-subtotal">
                    {{ item.price * item.quantity | currency:'BRL':'symbol':'1.2-2' }}
                  </div>
                  <button
                    mat-icon-button
                    class="remove-btn"
                    (click)="removeItem(item.id)"
                    matTooltip="Remover item"
                  >
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              }
            </div>

            <mat-divider class="divider" />

            <!-- Order Summary -->
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal ({{ totalQuantity() }} itens)</span>
                <span>{{ total() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div class="summary-row shipping">
                <span>Frete</span>
                <span class="free-shipping">Grátis</span>
              </div>
              <mat-divider class="summary-divider" />
              <div class="summary-row total-row">
                <span>Total</span>
                <span class="total-value">{{ total() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>

              <div class="cart-actions">
                <button mat-stroked-button (click)="clearCart()">
                  <mat-icon>delete_sweep</mat-icon>
                  Limpar
                </button>
                <button mat-raised-button color="accent" class="checkout-btn">
                  <mat-icon>payment</mat-icon>
                  Finalizar Pedido
                </button>
              </div>
            </div>
          }
        </section>
      </div>

      <!-- Signals Info Panel -->
      <div class="signals-info animate-fade-in-up" style="animation-delay: .3s">
        <h3 class="info-title">
          <mat-icon>info_outline</mat-icon>
          Implementação com Angular Signals
        </h3>
        <div class="signals-grid">
          <div class="signal-item">
            <span class="signal-label">signal(items)</span>
            <span class="signal-value">{{ items().length }} itens no carrinho</span>
          </div>
          <div class="signal-item">
            <span class="signal-label">computed(total)</span>
            <span class="signal-value">{{ total() | currency:'BRL':'symbol':'1.2-2' }}</span>
          </div>
          <div class="signal-item">
            <span class="signal-label">computed(totalQuantity)</span>
            <span class="signal-value">{{ totalQuantity() }} unidades</span>
          </div>
          <div class="signal-item">
            <span class="signal-label">output(totalChange)</span>
            <span class="signal-value">Emitido {{ outputEmitCount }} vez(es)</span>
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

    .cart-summary-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--color-card);
      border: 2px solid var(--color-border);
      border-radius: 50px;
      font-size: .9rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      transition: var(--transition);

      mat-icon { font-size: 20px; width: 20px; height: 20px; }

      &.has-items {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background: rgba(57, 73, 171, .05);
      }
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 24px;
      align-items: start;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .subsection-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--color-border);

      mat-icon { color: var(--color-primary); font-size: 20px; width: 20px; height: 20px; }
    }

    // Products
    .products-section {
      background: var(--color-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .product-card {
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      transition: var(--transition);
      text-align: center;

      &:hover {
        border-color: var(--color-primary-light);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }
    }

    .product-emoji {
      font-size: 2.5rem;
      line-height: 1;
    }

    .product-info { flex: 1; }

    .product-name {
      font-size: .9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 4px;
    }

    .product-price {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }

    .add-btn {
      width: 100%;
      font-size: .8rem !important;
    }

    // Cart
    .cart-section {
      background: var(--color-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
      position: sticky;
      top: 24px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--color-background);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      transition: var(--transition);

      &:hover { border-color: var(--color-primary-light); }
    }

    .item-emoji { font-size: 1.8rem; line-height: 1; }

    .item-details { flex: 1; min-width: 0; }

    .item-name {
      font-size: .85rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-unit-price {
      font-size: .75rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 2px;
    }

    .qty-btn {
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;

      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    .qty-value {
      font-size: .9rem;
      font-weight: 700;
      min-width: 24px;
      text-align: center;
      color: var(--color-text-primary);
    }

    .item-subtotal {
      font-size: .85rem;
      font-weight: 700;
      color: var(--color-primary);
      min-width: 72px;
      text-align: right;
    }

    .remove-btn {
      color: var(--color-error) !important;
      opacity: .6;
      transition: var(--transition);

      &:hover { opacity: 1; }
    }

    .divider, .summary-divider { margin: 16px 0; }

    .order-summary { margin-top: 8px; }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .9rem;
      color: var(--color-text-secondary);
      margin-bottom: 8px;

      &.shipping { color: var(--color-success); }
    }

    .free-shipping {
      font-weight: 600;
      color: var(--color-success);
    }

    .total-row {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 20px;
    }

    .total-value {
      font-size: 1.3rem;
      color: var(--color-primary);
    }

    .cart-actions {
      display: flex;
      gap: 12px;

      button { flex: 1; }
    }

    .checkout-btn { font-size: .85rem !important; }

    // Signals Info
    .signals-info {
      margin-top: 24px;
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

    .signals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }

    .signal-item {
      background: var(--color-card);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      border: 1px solid rgba(57, 73, 171, .15);
    }

    .signal-label {
      display: block;
      font-size: .7rem;
      font-weight: 700;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: .8px;
      margin-bottom: 4px;
      font-family: 'Courier New', monospace;
    }

    .signal-value {
      font-size: .9rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }
  `],
})
export class CartComponent implements OnInit {
  // ---- output() que emite sempre que o total mudar ----
  readonly totalChange = output<number>();

  // ---- Signal para a lista de itens ----
  readonly items = signal<CartItem[]>([]);

  // ---- Computed para o total (quantidade × preço) ----
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // ---- Computed para a quantidade total de unidades ----
  readonly totalQuantity = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  outputEmitCount = 0;

  readonly availableProducts: CartProduct[] = [
    { id: 1, name: 'Notebook Pro', price: 4999.99, imageUrl: '💻' },
    { id: 2, name: 'Mouse Ergonômico', price: 189.9, imageUrl: '🖱️' },
    { id: 3, name: 'Teclado Mecânico', price: 349.9, imageUrl: '⌨️' },
    { id: 4, name: 'Monitor 4K', price: 2799.0, imageUrl: '🖥️' },
    { id: 5, name: 'Headset Gamer', price: 599.9, imageUrl: '🎧' },
    { id: 6, name: 'Webcam HD', price: 299.9, imageUrl: '📷' },
  ];

  constructor(private snackBar: MatSnackBar) {
    // ---- effect() que dispara o output sempre que o total mudar ----
    effect(() => {
      const currentTotal = this.total();
      this.totalChange.emit(currentTotal);
      this.outputEmitCount++;
    });
  }

  ngOnInit(): void {}

  // ---- Método para adicionar item ----
  addItem(product: CartProduct): void {
    this.items.update((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });

    this.snackBar.open(`${product.name} adicionado ao carrinho`, '', {
      duration: 2000,
      panelClass: ['snack-success'],
    });
  }

  // ---- Método para remover item ----
  removeItem(id: number): void {
    this.items.update((current) => current.filter((i) => i.id !== id));
  }

  // ---- Método para incrementar quantidade ----
  incrementItem(id: number): void {
    this.items.update((current) =>
      current.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }

  // ---- Método para decrementar quantidade ----
  decrementItem(id: number): void {
    this.items.update((current) => {
      const item = current.find((i) => i.id === id);
      if (item && item.quantity <= 1) {
        return current.filter((i) => i.id !== id);
      }
      return current.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  // ---- Limpar carrinho ----
  clearCart(): void {
    this.items.set([]);
  }
}
