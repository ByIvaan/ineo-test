import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Task } from '../../interfaces/task.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksService, UpsertTaskModel } from '../../services/tasks.service';
import { Category } from '../../interfaces/category.interface';
import { ContrastColorPipe } from '../../pipes/contrast-color.pipe';
import { Skeleton } from 'primeng/skeleton';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpsertTaskDialogComponent } from '../kanban/task/upsert-task-dialog.component';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
    CommonModule,
    ContrastColorPipe,
    Skeleton,
    MultiSelect,
    CommonModule,
    FormsModule,
  ],
  providers: [DialogService],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  filterCategories: Category[] = [];
  isLoading = false;
  ref: DynamicDialogRef | undefined;
  isCategoriesLoading = false;

  constructor(
    private tasksService: TasksService,
    private destroyRef: DestroyRef,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadCategories();

    this.tasksService.onDataMutation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadTasks();
      });

    this.categoriesService.onDataMutation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadCategories();
      });
  }

  loadCategories() {
    this.isCategoriesLoading = true;
    this.categoriesService
      .getAll$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isCategoriesLoading = false;
        },
        error: () => {
          this.isCategoriesLoading = false;
        },
      });
  }

  loadTasks() {
    this.isLoading = true;
    this.tasksService
      .getAll$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  handleRefresh() {
    this.isLoading = true;
    this.tasksService
      .getAll$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  handleEditTask(task: Task) {
    this.ref = this.dialogService.open(UpsertTaskDialogComponent, {
      header: 'Edit Task',
      closable: true,
      modal: true,
      dismissableMask: true,
      width: '32rem',
      data: {
        task: task,
        showCategory: true,
        onSubmit: (payload: UpsertTaskModel) =>
          this.handleEditTaskSubmit(task, payload),
      },
    });
  }

  handleEditTaskSubmit(original: Task, payload: UpsertTaskModel) {
    this.tasksService.update$({ ...original, ...payload }).subscribe();
  }

  handleDeleteTask(e: MouseEvent, task: Task) {
    this.confirmationService.confirm({
      target: e.target as EventTarget,
      message: 'Are you sure you want to delete this task?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.tasksService.delete$(task).subscribe();
      },
    });
  }
}
