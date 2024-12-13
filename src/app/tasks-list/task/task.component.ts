import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { DragDropModule } from 'primeng/dragdrop';
import { TempDragCacheService } from '../../../services/temp-drag-cache.service';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'task',
  standalone: true,
  templateUrl: './task.component.html',
  imports: [DragDropModule, PanelModule],
})
export class TaskComponent implements OnInit {
  @Input({ required: true }) data!: Task;

  constructor(private tempDragCacheService: TempDragCacheService) {}

  ngOnInit() {
    console.log(this.data);
  }

  handleDragStart() {
    this.tempDragCacheService.setDraggedTask(this.data);
  }

  handleDragEnd() {
    this.tempDragCacheService.clearDraggedTask();
  }
}
