import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/category.interface';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { Task } from '../../../interfaces/task.interface';
import { ButtonModule } from 'primeng/button';
import { TaskComponent } from '../task/task.component';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { DragDropModule } from 'primeng/dragdrop';
import { TempDragCacheService } from '../../../services/temp-drag-cache.service';

@Component({
  selector: 'category',
  standalone: true,
  templateUrl: './category.component.html',
  imports: [
    CommonModule,
    PanelModule,
    FormsModule,
    ButtonModule,
    InplaceModule,
    InputTextModule,
    AutoFocusModule,
    DragDropModule,
    TaskComponent,
  ],
})
export class CategoryComponent implements OnInit {
  @Input({ required: true }) data!: Category;

  tasks: Task[] = [];

  constructor(
    private tasksService: TasksService,
    private tempDragCacheService: TempDragCacheService
  ) {}

  ngOnInit() {
    this.tasksService.getByCategoryId(this.data.id).subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.tasksService.onDataMutation$.subscribe(() => {
      this.tasksService.getByCategoryId(this.data.id).subscribe((tasks) => {
        this.tasks = tasks;
      });
    });
  }

  handleTaskDropped() {
    const task = this.tempDragCacheService.getDraggedTask();
    if (task) {
      this.tasksService.update({ ...task, categoryId: this.data.id });
    }
  }
}
