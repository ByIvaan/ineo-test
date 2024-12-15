import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { CategoryComponent } from './category/category.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpsertCategoryDialogComponent } from './category/upsert-category-dialog.component';
import { Category } from '../../interfaces/category.interface';
import {
  CategoriesService,
  UpsertCategoryModel,
} from '../../services/categories.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'kanban',
  standalone: true,
  templateUrl: './kanban.component.html',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InplaceModule,
    InputTextModule,
    AutoFocusModule,
    CategoryComponent,
    Skeleton,
  ],
  providers: [DialogService],
})
export class KanbanComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  categories: Category[] = [];
  isLoading = false;

  constructor(
    public categoriesService: CategoriesService,
    public dialogService: DialogService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadCategories();

    this.categoriesService.onDataMutation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadCategories();
      });
  }

  loadCategories() {
    this.isLoading = true;
    this.categoriesService
      .getAll$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  handleAddCategory() {
    this.ref = this.dialogService.open(UpsertCategoryDialogComponent, {
      header: 'Create Category',
      closable: true,
      modal: true,
      dismissableMask: true,
      width: '32rem',
      data: {
        onSubmit: (payload: UpsertCategoryModel) =>
          this.handleAddCategorySubmit(payload),
      },
    });
  }

  handleAddCategorySubmit(payload: UpsertCategoryModel) {
    this.categoriesService.create$(payload).subscribe();
  }
}
