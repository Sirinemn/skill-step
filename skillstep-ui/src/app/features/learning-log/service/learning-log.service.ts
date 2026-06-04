import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/internal/operators/tap';
import { LearningLog } from '../models/learning-log.model';
import { Page } from '../models/page.model';
import { LogFilters } from '../models/log-filter.model';
import { Observable } from 'rxjs';
import { LearningLogRequest } from '../models/learning-log-request.model';

@Injectable({
  providedIn: 'root'
})
export class LearningLogService {

  private readonly apiUrl = `${environment.apiUrl}/learning-log`;

  // Signal pour le total — utilisé par le dashboard
  readonly totalLogs$ = signal<number>(0);

  constructor(private http: HttpClient) { }

  getAll(filters: LogFilters = {}): Observable<Page<LearningLog>> {
    let params = new HttpParams();
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.from)       params = params.set('from', filters.from);
    if (filters.to)         params = params.set('to', filters.to);
    if (filters.search)     params = params.set('search', filters.search);
    if (filters.page != null) params = params.set('page', filters.page);
    if (filters.size)       params = params.set('size', filters.size);

    return this.http.get<Page<LearningLog>>(this.apiUrl, { params }).pipe(
      tap(page => this.totalLogs$.set(page.totalElements))
    );
  }

  getById(id: number): Observable<LearningLog> {
    return this.http.get<LearningLog>(`${this.apiUrl}/${id}`);
  }

  create(request: LearningLogRequest): Observable<LearningLog> {
    return this.http.post<LearningLog>(this.apiUrl, request);
  }

  update(id: number, request: LearningLogRequest): Observable<LearningLog> {
    return this.http.put<LearningLog>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
