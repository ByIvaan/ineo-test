import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { UpsertTaskModel } from '../../../services/tasks.service';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Category } from '../../../interfaces/category.interface';
import { CategoriesService } from '../../../services/categories.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'new-task-dialog-component',
  standalone: true,
  templateUrl: './upsert-task-dialog.component.html',
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    TextareaModule,
    Select,
  ],
})
export class UpsertTaskDialogComponent implements OnInit {
  form: FormGroup;
  onSubmit: (payload: UpsertTaskModel) => void = () => {};
  categories: Category[] = [];
  isCategoriesLoading = false;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private categoriesService: CategoriesService,
    private destroyRef: DestroyRef
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      categoryId: [0, Validators.required],
    });
    if (!this.config.data) {
      return;
    }
    if (typeof this.config.data.onSubmit === 'function') {
      this.onSubmit = this.config.data.onSubmit;
    }
    if (this.config.data.task) {
      this.form.patchValue(this.config.data.task);
    }
  }

  ngOnInit() {
    this.loadCategories();
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

  handleSubmit() {
    if (this.form.valid) {
      const payload = this.form.value;
      this.onSubmit(payload);
      this.ref.close();
    }
  }
}
