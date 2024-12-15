import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { KanbanComponent } from './kanban/kanban.component';

export const routes: Routes = [
  { path: '', component: KanbanComponent },
  {
    path: 'task-list',
    component: TaskListComponent,
  },
];
