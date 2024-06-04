import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  signinForm!: FormGroup;
  hasError = false;

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      userName: ['tzabar', [Validators.required, Validators.minLength(2)]],
      password: ['1948', [Validators.required, Validators.minLength(2)]],
    });
  }

  signin() {
    this.hasError = false;
    if (!this.signinForm.valid) return;
    this.authService.signin(this.signinForm.value).subscribe((result) => {
      if (result !== true) {
        this.hasError = true;
      }
    });
  }
}
