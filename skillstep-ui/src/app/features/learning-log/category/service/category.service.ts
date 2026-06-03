import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../models/category-response.model';
import { CategoryRequest } from '../models/category-request.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.baseUrl);
  }
  createCategory(categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.baseUrl, categoryRequest);
  }
  updateCategory(id: number, categoryRequest: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.baseUrl}/${id}`, categoryRequest);
  }
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}