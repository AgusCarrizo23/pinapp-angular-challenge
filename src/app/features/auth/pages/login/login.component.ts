import { Component, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  hidePassword = true;

  get emailControl(): AbstractControl<string, string> {
    return this.loginForm.controls.email;
  }

  get passwordControl(): AbstractControl<string, string> {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  shouldShowError(control: AbstractControl<string, string>): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  getEmailErrorMessage(): string {
    if (this.emailControl.hasError('required')) {
      return 'El email es obligatorio.';
    }

    if (this.emailControl.hasError('email')) {
      return 'Ingrese un email con un formato valido.';
    }

    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl.hasError('required')) {
      return 'La contrasena es obligatoria.';
    }

    if (this.passwordControl.hasError('minlength')) {
      return 'La contrasena debe tener al menos 6 caracteres.';
    }

    return '';
  }
}
