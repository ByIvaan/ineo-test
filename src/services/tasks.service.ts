import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TasksService {
  onDataMutation$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getByCategoryId(categoryId: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`/categories/${categoryId}/tasks`);
  }

  create(task: Task): Observable<Task> {
    return this.httpClient.post<Task>('/tasks', task).pipe(
      tap(() => {
        this.onDataMutation$.next();
      })
    );
  }

  update(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`/tasks/${task.id}`, task).pipe(
      tap(() => {
        this.onDataMutation$.next();
      })
    );
  }
}
