import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { UpsertCategoryModel } from '../../../services/categories.service';

@Component({
  selector: 'upsert-category-dialog-component',
  standalone: true,
  templateUrl: './upsert-category-dialog.component.html',
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, ColorPicker],
})
export class NewCategoryDialogComponent {
  form: FormGroup;
  onSubmit: (payload: UpsertCategoryModel) => void = () => {};

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000'], // default color,
    });
    if (this.config.data && typeof this.config.data.onSubmit === 'function') {
      this.onSubmit = this.config.data.onSubmit;
    }
    if (this.config.data && this.config.data.category) {
      this.form.patchValue(this.config.data.category);
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
