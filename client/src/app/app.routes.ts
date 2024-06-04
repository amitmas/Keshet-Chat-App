import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ChatComponent } from './chat/chat.component';
import { authGuard } from './guards/auth.guard';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [authGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
