import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateCategoryModel } from '../../../services/categories.service';

@Component({
  selector: 'new-category-dialog-component',
  standalone: true,
  templateUrl: './new-category-dialog.component.html',
  imports: [InputTextModule, ButtonModule, FloatLabel, ReactiveFormsModule],
})
export class NewCategoryDialogComponent {
  form: FormGroup;
  onSubmit: (payload: CreateCategoryModel) => void = () => {};

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
    if (this.config.data && typeof this.config.data.onSubmit === 'function') {
      this.onSubmit = this.config.data.onSubmit;
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      const payload = this.form.value;
      this.onSubmit(payload);
      this.ref.close();
    }
  }
}
