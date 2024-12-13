import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TempDragCacheService {
  draggedTask: Task | null = null;

  setDraggedTask(task: Task): void {
    this.draggedTask = task;
  }

  getDraggedTask(): Task | null {
    return this.draggedTask;
  }

  clearDraggedTask(): void {
    this.draggedTask = null;
  }
}
