import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Category } from '../models/category.model';
import { CategoryRequest } from '../models/category-request.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  // Cache local des catégories — évite des appels répétés
  readonly categories$ = signal<Category[]>([]);

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      // Met à jour le signal avec les données récupérées
      tap((categories) => this.categories$.set(categories))
    );
  }
  createCategory(categoryRequest: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, categoryRequest).pipe(
      // Ajoute la nouvelle catégorie au signal existant
      tap((newCategory) =>
        this.categories$.update((categories) => 
          [...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name))
        )
      )
    );
  }
  updateCategory(id: number,categoryRequest: CategoryRequest,): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`,categoryRequest,).pipe(
      tap((updatedCategory) =>
        this.categories$.update((categories) =>
          categories.map((cat) => (cat.id === id ? updatedCategory : cat))
        )
      )
    );
  }
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() =>
        this.categories$.update((categories) =>
          categories.filter((cat) => cat.id !== id)
        )
      )
    );
  }
}
