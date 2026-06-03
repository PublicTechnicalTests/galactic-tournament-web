import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentService } from './services/tournament.service';
import { FeatureListRankingComponent } from '../Ranking/feature-list-ranking/feature-list-ranking.component';

/**
 * DashboardComponent
 *
 * Main dashboard view for the Galactic Tournament SPA.
 *
 * Layout:
 * - **Actions section** (top): Two primary action buttons — Simulate Tournament
 *   and Simulate Combat — backed by `TournamentService`.
 * - **Ranking section** (bottom): Tabular ranking updated reactively via signals.
 *
 * All state is read from `TournamentService` signals; the component itself
 * holds no mutable state, enabling full OnPush optimization.
 */
@Component({
  selector: 'app-dashboard',
  imports: [TranslateModule, FeatureListRankingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly tournamentService = inject(TournamentService);

  /** True while a simulation is running — disables action buttons. */
  protected readonly isSimulating = this.tournamentService.isSimulating;

  /** Result summary of the last completed combat. */
  protected readonly lastCombatResult = this.tournamentService.lastCombatResult;

  /** Triggers a full tournament simulation. */
  protected simulateTournament(): void {
    this.tournamentService.simulateTournament();
  }

  /** Triggers a single combat simulation. */
  protected simulateCombat(): void {
    this.tournamentService.simulateCombat();
  }
}
