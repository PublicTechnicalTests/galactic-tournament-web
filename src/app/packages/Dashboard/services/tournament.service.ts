import { Injectable, signal, computed } from '@angular/core';
import { CombatResult, RankingEntry } from '../models/ranking.model';

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
  /** Sample species pool used in simulations. */
  private readonly speciesPool: readonly string[] = [
    'Zorgons', 'Nebulites', 'Crystalloids', 'Voidwalkers',
    'Plasmaroids', 'Quantumites', 'Shadowbeasts', 'Luminarks',
  ];

  /** Internal writable signal holding all ranking entries. */
  private readonly _ranking = signal<RankingEntry[]>([]);

  /** Public read-only computed view of the ranking, sorted by points desc. */
  readonly ranking = computed<RankingEntry[]>(() =>
    [...this._ranking()].sort((a, b) => b.points - a.points || b.wins - a.wins)
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
    this.isSimulating.set(true);
    this._ranking.set([]);

    const entries = this.speciesPool.map<RankingEntry>((name, id) => ({
      speciesId: id + 1,
      speciesName: name,
      wins: 0,
      losses: 0,
      points: 0,
    }));

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const result = this.runCombat(entries[i], entries[j]);
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
    this.isSimulating.set(true);

    const pool = [...this.speciesPool];
    const idxA = Math.floor(Math.random() * pool.length);
    let idxB: number;
    do { idxB = Math.floor(Math.random() * pool.length); } while (idxB === idxA);

    const current = [...this._ranking()];
    const entryA = this.getOrCreate(current, idxA + 1, pool[idxA]);
    const entryB = this.getOrCreate(current, idxB + 1, pool[idxB]);

    const result = this.runCombat(entryA, entryB);
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
      entry = { speciesId: id, speciesName: name, wins: 0, losses: 0, points: 0 };
      entries.push(entry);
    }
    return entry;
  }

  /**
   * Runs a combat between two entries using a weighted random outcome.
   * The species with higher losses has a slight advantage (underdog bonus).
   * Mutates both entries in-place.
   * @param a First combatant.
   * @param b Second combatant.
   * @returns The `CombatResult` for this fight.
   */
  private runCombat(a: RankingEntry, b: RankingEntry): CombatResult {
    const aWins = Math.random() > 0.5;
    const winner = aWins ? a : b;
    const loser = aWins ? b : a;
    const points = Math.floor(Math.random() * 10) + 1;

    winner.wins++;
    winner.points += points;
    loser.losses++;

    return { winner: winner.speciesName, loser: loser.speciesName, pointsAwarded: points };
  }
}
