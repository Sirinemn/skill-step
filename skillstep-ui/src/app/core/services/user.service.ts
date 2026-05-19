import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { tap } from 'rxjs/internal/operators/tap';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { UpdateProfilePayload } from '../models/updateProfilePayload.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(
    private readonly http:        HttpClient,
    private readonly authService: AuthService,
  ) { }

   getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/me`, payload).pipe(
      // Met à jour le signal dans AuthService après la sauvegarde
      tap(updatedUser => this.authService.setCurrentUser(updatedUser))
    );
  }
}
