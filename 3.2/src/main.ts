import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TodoComponent } from './app/todo/todo.component';
import { todoReducer } from './app/todo/store/todo.reducer';
import { TodoEffects } from './app/todo/store/todo.effects';

bootstrapApplication(TodoComponent, {
  providers: [
    provideAnimations(),
    provideStore({ todos: todoReducer }),
    provideEffects([TodoEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
}).catch((err) => console.error(err));
