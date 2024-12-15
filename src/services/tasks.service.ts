import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UpsertTaskModel {
  title: string;
  description: string;
  categoryId: number;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  onDataMutation$ = new Subject<{ id: number; categoryId: number }>();

  constructor(private httpClient: HttpClient) {}

  getAll$(): Observable<Task[]> {
    return this.httpClient.get<Task[]>('/tasks');
  }

  getByCategoryId$(categoryId: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`/categories/${categoryId}/tasks`);
  }

  create$(task: UpsertTaskModel): Observable<Task> {
    return this.httpClient.post<Task>('/tasks', task).pipe(
      tap(() => {
        this.onDataMutation$.next({
          id: -1,
          categoryId: task.categoryId,
        });
      })
    );
  }

  update$(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`/tasks/${task.id}`, task).pipe(
      tap(() => {
        this.onDataMutation$.next({ id: task.id, categoryId: task.categoryId });
      })
    );
  }

  delete$(task: Task): Observable<void> {
    return this.httpClient.delete<void>(`/tasks/${task.id}`).pipe(
      tap(() => {
        this.onDataMutation$.next({ id: task.id, categoryId: task.categoryId });
      })
    );
  }
}
