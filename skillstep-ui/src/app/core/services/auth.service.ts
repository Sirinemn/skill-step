import { Injectable, signal, computed } from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { Router }                       from '@angular/router';
import { catchError, finalize, tap }                          from 'rxjs/operators';
import { User }                         from '../models/user.model';
import { environment }                  from '../../../environments/environment';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Signal = état réactif Angular 17+
  // Quand currentUser$ change, tous les composants qui le lisent
  // se mettent à jour automatiquement — sans BehaviorSubject ni subscribe()
  private readonly currentUser$ = signal<User | null>(null);
  private readonly TOKEN_KEY    = 'skillstep_jwt';

  // Indique si Angular a terminé la restauration de la session
  private readonly initialized$ = signal(false);

  // Computed = valeur dérivée recalculée automatiquement
  readonly isAuthenticated$ = computed(() => this.currentUser$() !== null);
  readonly user$            = computed(() => this.currentUser$());
  readonly isInitialized$ = computed(() => this.initialized$());

  constructor(
    private readonly http:   HttpClient,
    private readonly router: Router,
  ) {
    // Au démarrage de l'app, si un token existe en storage,
    // on tente de récupérer le profil pour restaurer la session
    const token = this.getToken();

    if (!token) {
      // Aucun token → aucune session à restaurer
      this.initialized$.set(true);
      return;
    }

    // Token présent → on restaure la session
    this.fetchCurrentUser()
      .pipe(
        catchError((err) => {
          console.error(
            'Erreur lors de la restauration de session :',
            err
          );

          this.currentUser$.set(null);

          return of(null);
        }),
        finalize(() => {
          // Très important :
          // le guard pourra maintenant continuer
          this.initialized$.set(true);
        })
      )
      .subscribe();
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
      error: err => {
        console.log(err)
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

  setCurrentUser(user: User): void {
    this.currentUser$.set(user);
  }
}