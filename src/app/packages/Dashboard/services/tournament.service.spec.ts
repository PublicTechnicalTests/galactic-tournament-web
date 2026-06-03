import { TestBed } from '@angular/core/testing';
import { TournamentService } from './tournament.service';

describe('TournamentService', () => {
  let service: TournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentService);
  });

  // ── Unit tests ─────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty ranking', () => {
    expect(service.ranking()).toEqual([]);
  });

  it('should start with isSimulating = false', () => {
    expect(service.isSimulating()).toBe(false);
  });

  it('should start with lastCombatResult = null', () => {
    expect(service.lastCombatResult()).toBeNull();
  });

  // ── simulateTournament ─────────────────────────────────────────────────────

  it('simulateTournament should populate ranking with 12 entries', () => {
    service.simulateTournament();
    expect(service.ranking().length).toBe(12);
  });

  it('simulateTournament should return isSimulating = false when done', () => {
    service.simulateTournament();
    expect(service.isSimulating()).toBe(false);
  });

  it('simulateTournament should set lastCombatResult', () => {
    service.simulateTournament();
    expect(service.lastCombatResult()).not.toBeNull();
  });

  it('simulateTournament should produce ranking sorted by wins descending', () => {
    service.simulateTournament();
    const wins = service.ranking().map((e) => e.wins);
    for (let i = 0; i < wins.length - 1; i++) {
      expect(wins[i]).toBeGreaterThanOrEqual(wins[i + 1]);
    }
  });

  it('simulateTournament each entry should have wins + losses = 11 (round-robin)', () => {
    service.simulateTournament();
    for (const entry of service.ranking()) {
      expect(entry.wins + entry.losses).toBe(11);
    }
  });

  it('simulateTournament total wins across all entries should equal total combats', () => {
    service.simulateTournament();
    const totalWins = service.ranking().reduce((sum, e) => sum + e.wins, 0);
    // 12 species, C(12,2) = 66 combats
    expect(totalWins).toBe(66);
  });

  // ── simulateCombat ─────────────────────────────────────────────────────────

  it('simulateCombat should add at least one entry to ranking', () => {
    service.simulateCombat();
    expect(service.ranking().length).toBeGreaterThanOrEqual(1);
  });

  it('simulateCombat should set lastCombatResult with winner/loser', () => {
    service.simulateCombat();
    const result = service.lastCombatResult();
    expect(result).not.toBeNull();
    expect(result!.winner).toBeTruthy();
    expect(result!.loser).toBeTruthy();
    expect(result!.winner).not.toBe(result!.loser);
  });

  it('simulateCombat should return isSimulating = false when done', () => {
    service.simulateCombat();
    expect(service.isSimulating()).toBe(false);
  });

  it('simulateCombat accumulated over multiple calls should keep ranking valid', () => {
    service.simulateCombat();
    service.simulateCombat();
    service.simulateCombat();
    for (const entry of service.ranking()) {
      expect(entry.wins + entry.losses).toBeGreaterThanOrEqual(1);
    }
  });
});
