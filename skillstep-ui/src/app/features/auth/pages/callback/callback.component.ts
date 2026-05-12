import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Récupère le token depuis l'URL :
    // http://localhost:4200/auth/callback?token=eyJhbGci...
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.handleCallback(token);
    } else {
      // Pas de token dans l'URL → retour landing
      this.authService.logout();
    }
  }

}
