import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TournamentService } from '../../Dashboard/services/tournament.service';
import { RankingEntry } from '../../Dashboard/models/ranking.model';

/**
 * FeatureListRankingComponent
 *
 * Displays the full galactic-tournament ranking table powered by the
 * `TournamentService` signal. The list stays in sync automatically via
 * Angular's signal-based reactivity.
 */
@Component({
  selector: 'app-feature-list-ranking',
  imports: [TranslateModule],
  templateUrl: './feature-list-ranking.component.html',
  styleUrl: './feature-list-ranking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureListRankingComponent {
  private readonly tournamentService = inject(TournamentService);

  /** Sorted ranking entries (delegated to TournamentService). */
  protected readonly ranking = this.tournamentService.ranking;

  /** Whether any combat data exists. */
  protected readonly hasRanking = computed(
    () => this.ranking().length > 0
  );

  /** True while a simulation is running. */
  protected readonly isSimulating = this.tournamentService.isSimulating;

  /** Trigger a full round-robin tournament simulation. */
  protected simulateTournament(): void {
    this.tournamentService.simulateTournament();
  }

  /** Trigger a single-combat simulation. */
  protected simulateCombat(): void {
    this.tournamentService.simulateCombat();
  }

  /** Expose RankingEntry type for template usage. */
  protected trackBySpecies(_: number, entry: RankingEntry): number {
    return entry.speciesId;
  }
}
