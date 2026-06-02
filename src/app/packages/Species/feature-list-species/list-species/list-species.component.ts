import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SlicePipe } from '@angular/common';

import { SpeciesService } from '../../services/species.service';
import {
  SpeciesPage,
  SpeciesSortField,
  SortDirection,
} from '../../models/species.model';

/**
 * ListSpeciesComponent
 *
 * Displays the full paginated, filterable and sortable species registry table.
 *
 * Features:
 * - Live search filter applied on every keystroke
 * - Column header click to toggle sort asc/desc
 * - Page-size selector (5 / 10 / 25) and prev/next pagination controls
 * - Emits a `requestAdd` output (used by parent to open the add modal)
 * - Exposes a `reload()` method for the parent to call after a species is added
 */
@Component({
  selector: 'app-list-species',
  imports: [ReactiveFormsModule, TranslateModule, SlicePipe],
  templateUrl: './list-species.component.html',
  styleUrl: './list-species.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListSpeciesComponent implements OnInit {
  private readonly speciesService = inject(SpeciesService);
  private readonly fb = inject(FormBuilder);

  // ── Search form ──────────────────────────────────────────────────────────

  protected readonly searchControl = this.fb.control('');

  // ── Sorting state ────────────────────────────────────────────────────────

  protected readonly sortField = signal<SpeciesSortField>('name');
  protected readonly sortDirection = signal<SortDirection>('asc');

  // ── Pagination state ─────────────────────────────────────────────────────

  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly pageSizeOptions = [5, 10, 25] as const;

  // ── Derived page ─────────────────────────────────────────────────────────

  /**
   * Computed species page — recalculates whenever any query parameter changes.
   * The search control value is read imperatively to allow signal tracking.
   */
  protected readonly page = computed<SpeciesPage>(() =>
    this.speciesService.getPage({
      search: this.searchValue(),
      sortField: this.sortField(),
      sortDirection: this.sortDirection(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
    })
  );

  /** Signal wrapper around the search control value for computed tracking. */
  private readonly searchValue = signal('');

  /** Convenience range array for pagination rendering. */
  protected readonly pageRange = computed<number[]>(() => {
    const total = this.page().totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((val) => {
      this.searchValue.set(val ?? '');
      this.currentPage.set(1);
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /** Called by parent after a new species is successfully added. */
  reload(): void {
    this.currentPage.set(1);
    this.searchValue.set(this.searchControl.value ?? '');
  }

  // ── Template handlers ─────────────────────────────────────────────────────

  protected sortBy(field: SpeciesSortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  protected goToPage(p: number): void {
    this.currentPage.set(p);
  }

  protected prevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  protected nextPage(): void {
    this.currentPage.update((p) => Math.min(this.page().totalPages, p + 1));
  }

  protected onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(value);
    this.currentPage.set(1);
  }

  /** Returns the sort indicator arrow for a column header. */
  protected sortIndicator(field: SpeciesSortField): string {
    if (this.sortField() !== field) return '';
    return this.sortDirection() === 'asc' ? ' ▲' : ' ▼';
  }

  /** aria-sort value for accessible column headers. */
  protected ariaSort(field: SpeciesSortField): 'ascending' | 'descending' | 'none' {
    if (this.sortField() !== field) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }
}
