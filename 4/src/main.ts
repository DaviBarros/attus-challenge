import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UserListComponent } from './app/users/components/user-list/user-list.component';

bootstrapApplication(UserListComponent, {
  providers: [provideAnimations()],
}).catch((err) => console.error(err));
