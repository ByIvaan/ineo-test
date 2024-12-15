import { Component, Input } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { DragDropModule } from 'primeng/dragdrop';
import { TempDragCacheService } from '../../../services/temp-drag-cache.service';
import { PanelModule } from 'primeng/panel';
import { UpsertTaskModel, TasksService } from '../../../services/tasks.service';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpsertTaskDialogComponent } from './upsert-task-dialog.component';

@Component({
  selector: 'task',
  standalone: true,
  templateUrl: './task.component.html',
  imports: [DragDropModule, PanelModule, Tooltip],
})
export class TaskComponent {
  @Input({ required: true }) data!: Task;
  ref: DynamicDialogRef | undefined;

  constructor(
    private tempDragCacheService: TempDragCacheService,
    private tasksService: TasksService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  handleDragStart() {
    this.tempDragCacheService.setDraggedTask(this.data);
  }

  handleDragEnd() {
    this.tempDragCacheService.clearDraggedTask();
  }

  handleEditTask() {
    this.ref = this.dialogService.open(UpsertTaskDialogComponent, {
      header: 'Edit Task',
      closable: true,
      modal: true,
      dismissableMask: true,
      width: '32rem',
      data: {
        task: this.data,
        onSubmit: (payload: UpsertTaskModel) =>
          this.handleEditTaskSubmit(payload),
      },
    });
  }

  handleEditTaskSubmit(payload: UpsertTaskModel) {
    this.tasksService.update$({ ...this.data, ...payload }).subscribe();
  }

  handleDeleteTask(e: MouseEvent) {
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
        this.tasksService.delete$(this.data).subscribe();
      },
    });
  }
}
