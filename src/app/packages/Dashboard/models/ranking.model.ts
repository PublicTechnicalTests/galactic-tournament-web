/**
 * Represents a single entry in the tournament ranking table.
 */
export interface RankingEntry {
  /** Unique identifier for the species. */
  speciesId: number;
  /** Display name of the species. */
  speciesName: string;
  /** Number of won combats. */
  wins: number;
  /** Number of lost combats. */
  losses: number;
  /** Total accumulated points. */
  points: number;
}

/**
 * Represents the result of a single combat simulation.
 */
export interface CombatResult {
  /** Name of the winning species. */
  winner: string;
  /** Name of the losing species. */
  loser: string;
  /** Points awarded to the winner. */
  pointsAwarded: number;
}
