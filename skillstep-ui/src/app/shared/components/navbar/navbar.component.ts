import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private readonly authService: AuthService) {}

  onLogin(): void {
    this.authService.loginWithGoogle();
  }

}
