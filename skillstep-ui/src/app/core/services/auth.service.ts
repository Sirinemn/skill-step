import { Injectable, signal, computed } from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { Router }                       from '@angular/router';
import { tap }                          from 'rxjs/operators';
import { User }                         from '../models/user.model';
import { environment }                  from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Signal = état réactif Angular 17+
  // Quand currentUser$ change, tous les composants qui le lisent
  // se mettent à jour automatiquement — sans BehaviorSubject ni subscribe()
  private readonly currentUser$ = signal<User | null>(null);
  private readonly TOKEN_KEY    = 'skillstep_jwt';

  // Computed = valeur dérivée recalculée automatiquement
  readonly isAuthenticated$ = computed(() => this.currentUser$() !== null);
  readonly user$            = computed(() => this.currentUser$());

  constructor(
    private readonly http:   HttpClient,
    private readonly router: Router,
  ) {
    // Au démarrage de l'app, si un token existe en storage,
    // on tente de récupérer le profil pour restaurer la session
    if (this.getToken()) {
      this.fetchCurrentUser().subscribe({
        error: () => this.logout() // token expiré → déconnexion propre
      });
    }
  }

  // Redirige vers Spring Boot qui redirige vers Google
  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/oauth2/authorization/google`;
  }

  // Appelé par la page callback après redirection Google
  handleCallback(token: string): void {
    this.saveToken(token);
    this.fetchCurrentUser().subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.logout();
        this.router.navigate(['/']);
      }
    });
  }

  // Récupère le profil depuis /auth/me
  fetchCurrentUser() {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => this.currentUser$.set(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser$.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}