import { Injectable, signal, computed, inject } from '@angular/core';
import { CombatResult, RankingEntry } from '../models/ranking.model';
import { SpeciesService } from '../../Species/services/species.service';
import { Species } from '../../Species/models/species.model';

/**
 * TournamentService
 *
 * Singleton service responsible for simulating galactic tournament combats
 * and maintaining the current ranking state via Angular signals.
 *
 * All simulation logic is deterministic and pure — the state is managed
 * entirely through signals to support OnPush change detection.
 */
@Injectable({ providedIn: 'root' })
export class TournamentService {
  private readonly speciesService = inject(SpeciesService);

  /** Internal writable signal holding all ranking entries. */
  private readonly _ranking = signal<RankingEntry[]>([]);

  /** Public read-only computed view of the ranking, sorted by wins desc. */
  readonly ranking = computed<RankingEntry[]>(() =>
    [...this._ranking()].sort((a, b) => b.wins - a.wins)
  );

  /** Indicates whether a simulation is currently in progress. */
  readonly isSimulating = signal(false);

  /** Holds the result of the last completed combat simulation. */
  readonly lastCombatResult = signal<CombatResult | null>(null);

  /**
   * Simulates a full round-robin tournament between all species in the pool.
   * Every species fights every other species once.
   * Results are aggregated and stored in the ranking signal.
   */
  simulateTournament(): void {
    const species = this.speciesService.allSpecies();
    if (species.length < 2) return;

    this.isSimulating.set(true);
    this._ranking.set([]);

    const entries = species.map<RankingEntry>((s) => ({
      speciesId: s.id,
      speciesName: s.name,
      wins: 0,
      losses: 0,
    }));

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const result = this.runCombat(species[i], entries[i], species[j], entries[j]);
        this.lastCombatResult.set(result);
      }
    }

    this._ranking.set(entries);
    this.isSimulating.set(false);
  }

  /**
   * Simulates a single combat between two randomly chosen species.
   * Updates only the two participants in the existing ranking (or adds them).
   */
  simulateCombat(): void {
    const species = this.speciesService.allSpecies();
    if (species.length < 2) return;

    this.isSimulating.set(true);

    const idxA = Math.floor(Math.random() * species.length);
    let idxB: number;
    do { idxB = Math.floor(Math.random() * species.length); } while (idxB === idxA);

    const speciesA = species[idxA];
    const speciesB = species[idxB];

    const current = [...this._ranking()];
    const entryA = this.getOrCreate(current, speciesA.id, speciesA.name);
    const entryB = this.getOrCreate(current, speciesB.id, speciesB.name);

    const result = this.runCombat(speciesA, entryA, speciesB, entryB);
    this.lastCombatResult.set(result);
    this._ranking.set(current);
    this.isSimulating.set(false);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Resolves an existing ranking entry or creates and inserts a new one.
   * @param entries Mutable ranking array to search and potentially modify.
   * @param id Unique species identifier.
   * @param name Display name for the species.
   * @returns The resolved or newly created `RankingEntry`.
   */
  private getOrCreate(entries: RankingEntry[], id: number, name: string): RankingEntry {
    let entry = entries.find((e) => e.speciesId === id);
    if (!entry) {
      entry = { speciesId: id, speciesName: name, wins: 0, losses: 0 };
      entries.push(entry);
    }
    return entry;
  }

  /**
   * Runs a deterministic combat between two species.
   * The species with higher power wins; on a tie, alphabetical order decides.
   * Mutates both ranking entries in-place.
   */
  private runCombat(
    speciesA: Species, entryA: RankingEntry,
    speciesB: Species, entryB: RankingEntry,
  ): CombatResult {
    const aWins = speciesA.power !== speciesB.power
      ? speciesA.power > speciesB.power
      : speciesA.name.localeCompare(speciesB.name) < 0;

    const winner = aWins ? entryA : entryB;
    const loser  = aWins ? entryB : entryA;

    winner.wins++;
    loser.losses++;

    return { winner: winner.speciesName, loser: loser.speciesName };
  }
}
