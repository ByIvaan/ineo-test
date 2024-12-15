import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

export interface UpsertCategoryModel {
  name: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  onDataMutation$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getAll$(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('/categories');
  }

  create$(category: UpsertCategoryModel): Observable<Category> {
    return this.httpClient.post<Category>('/categories', category).pipe(
      tap(() => {
        this.onDataMutation$.next();
      })
    );
  }

  update$(category: Category): Observable<Category> {
    return this.httpClient
      .put<Category>(`/categories/${category.id}`, category)
      .pipe(
        tap(() => {
          this.onDataMutation$.next();
        })
      );
  }

  delete$(category: Category): Observable<void> {
    return this.httpClient.delete<void>(`/categories/${category.id}`).pipe(
      tap(() => {
        this.onDataMutation$.next();
      })
    );
  }
}
