import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DashboardStats } from '../models/dashboard-stats.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl = `${environment.apiUrl}/dashboard/stats`;

  // Signal — partagé avec d'autres composants si besoin
  readonly stats$ = signal<DashboardStats | null>(null);

  constructor(private readonly http: HttpClient) { }

  loadStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl).pipe(
      tap(stats => this.stats$.set(stats))
    );
  }

  // Formate les minutes en affichage lisible
  // 75 → "1h 15min" / 45 → "45 min"
  static formatDuration(minutes: number): string {
    if (minutes === 0) return '0 min';
    if (minutes < 60)  return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
}
