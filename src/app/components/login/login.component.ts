import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg: string = "";

  rolesDisponibles = ["Administrador", "Nivel Central", "Equipo Local"];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ["", Validators.required],
      rol: ["Equipo Local", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { usuario, rol } = this.loginForm.value;
      this.authService.login(usuario, rol);
    }
  }
}
