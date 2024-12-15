import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    MenuModule,
    PanelModule,
    RouterModule,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './app.component.html',
})
export class AppComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Kanban', icon: 'pi pi-objects-column', routerLink: ['/'] },
      { label: 'Task List', icon: 'pi pi-list', routerLink: ['/task-list'] },
    ];
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      this.toggleDarkMode();
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');
    const darkMode = element?.classList.contains('dark');
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }
}
