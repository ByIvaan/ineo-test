import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { CategoryComponent } from './category/category.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewCategoryDialogComponent } from './category/new-category-dialog.component';
import { Category } from '../../interfaces/category.interface';
import {
  CategoriesService,
  CreateCategoryModel,
} from '../../services/categories.service';

@Component({
  selector: 'tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InplaceModule,
    InputTextModule,
    AutoFocusModule,
    CategoryComponent,
  ],
  providers: [DialogService],
})
export class TasksListComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  categories: Category[] = [];

  constructor(
    public categoriesService: CategoriesService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.categoriesService.getAll().subscribe((categories) => {
      this.categories = categories;
      console.log(this.categories);
    });

    this.categoriesService.onDataMutation$.subscribe(() => {
      this.categoriesService.getAll().subscribe((categories) => {
        this.categories = categories;
      });
    });
  }

  handleAddCategory() {
    this.ref = this.dialogService.open(NewCategoryDialogComponent, {
      header: 'Create Category',
      closable: true,
      modal: true,
      dismissableMask: true,
      width: '32rem',
      data: {
        onSubmit: (payload: CreateCategoryModel) =>
          this.handleAddCategorySubmit(payload),
      },
    });
  }

  handleAddCategorySubmit(payload: CreateCategoryModel) {
    this.categoriesService.create(payload).subscribe();
  }
}
