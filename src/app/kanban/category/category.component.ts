import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/category.interface';
import { FormsModule } from '@angular/forms';
import { UpsertTaskModel, TasksService } from '../../../services/tasks.service';
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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpsertTaskDialogComponent } from '../task/upsert-task-dialog.component';
import { Tooltip } from 'primeng/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Skeleton } from 'primeng/skeleton';
import { Popover } from 'primeng/popover';
import { Menu } from 'primeng/menu';
import {
  ConfirmationService,
  MenuItem,
  MenuItemCommandEvent,
} from 'primeng/api';
import {
  CategoriesService,
  UpsertCategoryModel,
} from '../../../services/categories.service';
import { NewCategoryDialogComponent as UpsertCategoryDialogComponent } from './upsert-category-dialog.component';

@Component({
  selector: 'category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
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
    Tooltip,
    Skeleton,
    Popover,
    Menu,
  ],
})
export class CategoryComponent implements OnInit {
  @Input({ required: true }) data!: Category;

  ref: DynamicDialogRef | undefined;
  tasks: Task[] = [];
  isLoading = false; // Added isLoading state
  menuItems: MenuItem[] = [];

  constructor(
    private tasksService: TasksService,
    private tempDragCacheService: TempDragCacheService,
    private dialogService: DialogService,
    private destroyRef: DestroyRef,
    private categoriesService: CategoriesService,
    private confirmationService: ConfirmationService
  ) {
    this.menuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: (e) => this.handleEditCategory(e, this.dialogService),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: (e) => this.handleDeleteCategory(e, this.confirmationService),
      },
    ];
  }

  ngOnInit() {
    this.loadTasks();

    this.tasksService.onDataMutation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => {
        if (this.tasks.some((task) => task.id === update.id)) {
          this.loadTasks(true);
        }
        if (update.categoryId === this.data.id) {
          this.loadTasks();
        }
      });
  }

  loadTasks(disableLoading = false) {
    this.isLoading = !disableLoading;
    this.tasksService
      .getByCategoryId$(this.data.id)
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

  handleTaskDropped() {
    const task = this.tempDragCacheService.getDraggedTask();
    if (task && task.categoryId !== this.data.id) {
      this.tasksService
        .update$({ ...task, categoryId: this.data.id })
        .subscribe();
    }
  }

  handleAddTask() {
    this.ref = this.dialogService.open(UpsertTaskDialogComponent, {
      header: 'Create Task',
      closable: true,
      modal: true,
      dismissableMask: true,
      width: '32rem',
      data: {
        onSubmit: (payload: UpsertTaskModel) =>
          this.handleAddTaskSubmit(payload),
      },
    });
  }

  handleAddTaskSubmit(payload: UpsertTaskModel) {
    payload.categoryId = this.data.id;
    this.tasksService.create$(payload).subscribe();
  }

  handleDeleteCategory(
    e: MenuItemCommandEvent,
    confirmationService: ConfirmationService
  ) {
    confirmationService.confirm({
      target: e.originalEvent?.target as EventTarget,
      message:
        'Are you sure you want to delete this category? All tasks will be deleted as well.',
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
        this.categoriesService.delete$(this.data).subscribe();
      },
    });
  }

  handleEditCategory(e: MenuItemCommandEvent, dialogService: DialogService) {
    dialogService.open(UpsertCategoryDialogComponent, {
      header: 'Edit Category',
      closable: true,
      modal: true,
      dismissableMask: true,
      width: '32rem',
      data: {
        category: this.data,
        onSubmit: (payload: UpsertCategoryModel) =>
          this.handleEditCategorySubmit(payload),
      },
    });
  }

  handleEditCategorySubmit(payload: UpsertCategoryModel) {
    this.categoriesService.update$({ ...this.data, ...payload }).subscribe();
  }
}
