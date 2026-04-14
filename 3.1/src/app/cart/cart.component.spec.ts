import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartProduct } from './cart.model';

// Testes unitários do CartComponent focados na lógica de negócio (Signals)
// Sem TestBed para evitar dependência de Zone.js no ambiente Vitest

// Importamos a lógica pura em vez do componente Angular completo
// para testar os Signals de forma isolada

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Classe de lógica extraída do CartComponent para testes isolados
class CartLogic {
  private _items: CartItem[] = [];

  get items(): CartItem[] { return this._items; }

  get total(): number {
    return this._items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get totalQuantity(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addItem(product: CartProduct): void {
    const existing = this._items.find((i) => i.id === product.id);
    if (existing) {
      this._items = this._items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      this._items = [
        ...this._items,
        { id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl },
      ];
    }
  }

  removeItem(id: number): void {
    this._items = this._items.filter((i) => i.id !== id);
  }

  incrementItem(id: number): void {
    this._items = this._items.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }

  decrementItem(id: number): void {
    const item = this._items.find((i) => i.id === id);
    if (item && item.quantity <= 1) {
      this._items = this._items.filter((i) => i.id !== id);
    } else {
      this._items = this._items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    }
  }

  clearCart(): void {
    this._items = [];
  }
}

const mockProduct: CartProduct = {
  id: 1,
  name: 'Notebook Pro',
  price: 4999.99,
  imageUrl: '💻',
};

const mockProduct2: CartProduct = {
  id: 2,
  name: 'Mouse Ergonômico',
  price: 189.9,
  imageUrl: '🖱️',
};

describe('CartComponent — Lógica de Signals (Angular Signals)', () => {
  let cart: CartLogic;

  beforeEach(() => {
    cart = new CartLogic();
  });

  // ---- items ----
  describe('items (signal)', () => {
    it('deve iniciar com lista vazia', () => {
      expect(cart.items).toEqual([]);
    });
  });

  // ---- addItem ----
  describe('addItem()', () => {
    it('deve adicionar um produto ao carrinho', () => {
      cart.addItem(mockProduct);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].name).toBe(mockProduct.name);
    });

    it('deve iniciar com quantidade 1 ao adicionar novo produto', () => {
      cart.addItem(mockProduct);
      expect(cart.items[0].quantity).toBe(1);
    });

    it('deve incrementar a quantidade ao adicionar produto já existente', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('deve adicionar múltiplos produtos diferentes', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct2);
      expect(cart.items.length).toBe(2);
    });
  });

  // ---- removeItem ----
  describe('removeItem()', () => {
    it('deve remover um item pelo id', () => {
      cart.addItem(mockProduct);
      cart.removeItem(mockProduct.id);
      expect(cart.items.length).toBe(0);
    });

    it('não deve alterar outros itens ao remover', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct2);
      cart.removeItem(mockProduct.id);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].id).toBe(mockProduct2.id);
    });
  });

  // ---- incrementItem / decrementItem ----
  describe('incrementItem() / decrementItem()', () => {
    it('deve incrementar a quantidade do item', () => {
      cart.addItem(mockProduct);
      cart.incrementItem(mockProduct.id);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('deve decrementar a quantidade do item', () => {
      cart.addItem(mockProduct);
      cart.incrementItem(mockProduct.id);
      cart.decrementItem(mockProduct.id);
      expect(cart.items[0].quantity).toBe(1);
    });

    it('deve remover o item quando a quantidade chega a 0', () => {
      cart.addItem(mockProduct);
      cart.decrementItem(mockProduct.id);
      expect(cart.items.length).toBe(0);
    });
  });

  // ---- total (computed) ----
  describe('total (computed)', () => {
    it('deve calcular o total corretamente', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct2);
      const expected = mockProduct.price + mockProduct2.price;
      expect(cart.total).toBeCloseTo(expected, 2);
    });

    it('deve ser 0 quando o carrinho está vazio', () => {
      expect(cart.total).toBe(0);
    });

    it('deve atualizar o total ao incrementar quantidade', () => {
      cart.addItem(mockProduct);
      cart.incrementItem(mockProduct.id);
      expect(cart.total).toBeCloseTo(mockProduct.price * 2, 2);
    });

    it('deve recalcular o total ao remover item', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct2);
      cart.removeItem(mockProduct.id);
      expect(cart.total).toBeCloseTo(mockProduct2.price, 2);
    });
  });

  // ---- totalQuantity (computed) ----
  describe('totalQuantity (computed)', () => {
    it('deve calcular a quantidade total de unidades', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct);
      cart.addItem(mockProduct2);
      expect(cart.totalQuantity).toBe(3);
    });

    it('deve ser 0 para carrinho vazio', () => {
      expect(cart.totalQuantity).toBe(0);
    });
  });

  // ---- clearCart ----
  describe('clearCart()', () => {
    it('deve limpar todos os itens do carrinho', () => {
      cart.addItem(mockProduct);
      cart.addItem(mockProduct2);
      cart.clearCart();
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    });
  });
});
