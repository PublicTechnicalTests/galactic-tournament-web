import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/** Represents a navigation menu item in the sidebar. */
interface NavItem {
  /** Translation key for the label. */
  labelKey: string;
  /** Emoji/icon to display alongside the label. */
  icon: string;
  /** Angular router path this item navigates to. */
  route: string;
}

/**
 * SidebarComponent
 *
 * Renders the main application navigation sidebar.
 * Supports collapsible behavior and internationalization via @ngx-translate.
 * All interactive elements meet WCAG AA focus and contrast requirements.
 */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /** Controls whether the sidebar is in collapsed (icon-only) mode. */
  protected readonly isCollapsed = signal(false);

  /** Ordered list of navigation items displayed in the sidebar menu. */
  protected readonly navItems: readonly NavItem[] = [
    { labelKey: 'SIDEBAR.MENU.DASHBOARD', icon: '🏆', route: '/dashboard' },
    { labelKey: 'SIDEBAR.MENU.SPECIES',   icon: '👽', route: '/species'   },
    { labelKey: 'SIDEBAR.MENU.RANKING',   icon: '📊', route: '/ranking'   },
  ];

  /** Toggles the sidebar between expanded and collapsed states. */
  protected toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }
}
