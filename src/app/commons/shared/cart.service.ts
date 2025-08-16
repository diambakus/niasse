import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from './common-topics';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private shoppingCart = signal<CartItem[]>([]);
  private sCartSubject = new BehaviorSubject<CartItem[]>(this.shoppingCart());
  
  shoppingCart$: Observable<CartItem[]> = this.sCartSubject.asObservable();

  constructor() { 
    effect(() =>
      this.sCartSubject.next(this.shoppingCart())
    )
  }

  subtract(commodityId: number) {
    let currentCart = this.shoppingCart();

    const itemIndex = currentCart.findIndex((item, _) => item.commodityId === commodityId);

    if (itemIndex !== -1) {
      currentCart[itemIndex].quantity -= 1;

      if (currentCart[itemIndex].quantity === 0) {
        currentCart = currentCart.filter(item => item.commodityId !== commodityId);
      }
    }

    this.shoppingCart.set(currentCart);
  }

  totalQuantity = computed(() => this.shoppingCart().reduce((accumulate, item) => accumulate + item.quantity, 0));

  totalPrice = computed(() => this.shoppingCart().reduce((accumulate, item) => accumulate + item.quantity * item.price, 0));

  add(cartItem: CartItem) {
    const currentCart = this.shoppingCart();
    const itemIndex = currentCart.findIndex((item, _) => item.commodityId === cartItem.commodityId);

    if (itemIndex === -1) {
      currentCart.push(cartItem);
    } else {
      currentCart[itemIndex].quantity += 1;
    }

    this.shoppingCart.set([...currentCart]);
  }

  clear() {
    this.shoppingCart.set([]);
  }

  getSelectedCommodityId(): number {
    const currentCart = this.shoppingCart();
    return currentCart.length > 0 ? currentCart[currentCart.length - 1].commodityId : 0;
  }
}