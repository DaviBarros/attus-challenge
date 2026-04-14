import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CartComponent } from './app/cart/cart.component';

bootstrapApplication(CartComponent, {
  providers: [provideAnimations()],
}).catch((err) => console.error(err));
