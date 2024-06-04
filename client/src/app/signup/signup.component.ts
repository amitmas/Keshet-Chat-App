import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm!: FormGroup;
  hasError = false;

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['Israel', [Validators.required, Validators.minLength(2)]],
      lastName: ['Israely', [Validators.required, Validators.minLength(2)]],
      userName: ['tzabar', [Validators.required, Validators.minLength(2)]],
      password: ['1948', [Validators.required, Validators.minLength(2)]],
    });
  }

  signup() {
    this.hasError = false;
    if (!this.signupForm.valid) return;
    this.authService.signup(this.signupForm.value).subscribe((result) => {
      if (result === true) {
        this.router.navigate(['/chat']);
      } else {
        this.hasError = true;
      }
    });
  }
}
