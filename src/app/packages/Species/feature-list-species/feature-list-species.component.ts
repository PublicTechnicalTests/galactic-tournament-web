import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListSpeciesComponent } from './list-species/list-species.component';

/**
 * FeatureListSpeciesComponent
 *
 * Shell component for the Species list feature.
 * Hosts `ListSpeciesComponent` and provides the action bar with the
 * "Add Species" button. After a species is successfully added the
 * add-species modal will call `listRef.reload()` via this parent.
 *
 * The add-species modal (feature-04) will be wired here iteratively.
 */
@Component({
  selector: 'app-feature-list-species',
  imports: [TranslateModule, ListSpeciesComponent],
  templateUrl: './feature-list-species.component.html',
  styleUrl: './feature-list-species.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureListSpeciesComponent {
  /** Reference to the list child to call reload after an add operation. */
  @ViewChild(ListSpeciesComponent) protected listRef!: ListSpeciesComponent;

  /** Controls visibility of the add-species modal (wired in feature-04). */
  protected showAddModal = false;

  /** Opens the add-species modal. */
  protected openAddModal(): void {
    this.showAddModal = true;
  }

  /** Called by the add-species modal when a species has been saved. */
  protected onSpeciesAdded(): void {
    this.showAddModal = false;
    this.listRef?.reload();
  }

  /** Called by the add-species modal when the operation is cancelled. */
  protected onAddCancelled(): void {
    this.showAddModal = false;
  }
}
