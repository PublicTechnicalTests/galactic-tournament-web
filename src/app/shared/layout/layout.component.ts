import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

/**
 * LayoutComponent
 *
 * Root shell component that composes the main application layout:
 * a collapsible sidebar on the left and a scrollable content area on the right.
 * Feature components are rendered inside the `<router-outlet>`.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
