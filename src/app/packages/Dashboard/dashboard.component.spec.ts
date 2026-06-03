import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardComponent } from './dashboard.component';
import { TournamentService } from './services/tournament.service';
import { RankingEntry, CombatResult } from './models/ranking.model';

/** Minimal mock that mirrors the signals used by the component. */
const mockRankingEntries: RankingEntry[] = [
  { speciesId: 1, speciesName: 'Zorgons',   wins: 5, losses: 2 },
  { speciesId: 2, speciesName: 'Nebulites', wins: 3, losses: 4 },
];

const mockCombatResult: CombatResult = {
  winner: 'Zorgons',
  loser:  'Nebulites',
};

function createMockService(overrides: Partial<{
  ranking: RankingEntry[];
  isSimulating: boolean;
  lastCombatResult: CombatResult | null;
}> = {}) {
  const ranking = signal(overrides.ranking ?? []);
  const isSimulating = signal(overrides.isSimulating ?? false);
  const lastCombatResult = signal<CombatResult | null>(overrides.lastCombatResult ?? null);

  return {
    ranking,
    isSimulating,
    lastCombatResult,
    simulateTournament: vi.fn(),
    simulateCombat:     vi.fn(),
  };
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let nativeEl: HTMLElement;
  let mockService: ReturnType<typeof createMockService>;

  beforeEach(async () => {
    mockService = createMockService();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, TranslateModule.forRoot()],
      providers: [{ provide: TournamentService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  // ── Unit tests ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the actions section', () => {
    expect(nativeEl.querySelector('.dashboard__actions')).not.toBeNull();
  });

  it('should render the ranking section', () => {
    expect(nativeEl.querySelector('.dashboard__ranking')).not.toBeNull();
  });

  it('should render Simulate Tournament button', () => {
    const btns = nativeEl.querySelectorAll('.btn--primary');
    expect(btns.length).toBeGreaterThan(0);
  });

  it('should render Simulate Combat button', () => {
    const btns = nativeEl.querySelectorAll('.btn--secondary');
    expect(btns.length).toBeGreaterThan(0);
  });

  it('should show empty state when ranking is empty', () => {
    expect(nativeEl.querySelector('.feature-list-ranking__empty')).not.toBeNull();
    expect(nativeEl.querySelector('.ranking-table')).toBeNull();
  });

  // ── Actions ────────────────────────────────────────────────────────────────

  it('should call simulateTournament on primary button click', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.btn--primary')!;
    btn.click();
    expect(mockService.simulateTournament).toHaveBeenCalledTimes(1);
  });

  it('should call simulateCombat on secondary button click', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.btn--secondary')!;
    btn.click();
    expect(mockService.simulateCombat).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isSimulating is true', () => {
    mockService.isSimulating.set(true);
    fixture.detectChanges();
    const primaryBtn = nativeEl.querySelector<HTMLButtonElement>('.btn--primary')!;
    const secondaryBtn = nativeEl.querySelector<HTMLButtonElement>('.btn--secondary')!;
    expect(primaryBtn.disabled).toBe(true);
    expect(secondaryBtn.disabled).toBe(true);
  });

  it('should enable buttons when isSimulating is false', () => {
    mockService.isSimulating.set(false);
    fixture.detectChanges();
    const primaryBtn = nativeEl.querySelector<HTMLButtonElement>('.btn--primary')!;
    expect(primaryBtn.disabled).toBe(false);
  });

  // ── Ranking table ──────────────────────────────────────────────────────────

  it('should show ranking table when entries exist', () => {
    mockService.ranking.set(mockRankingEntries);
    fixture.detectChanges();
    expect(nativeEl.querySelector('.ranking-table')).not.toBeNull();
    expect(nativeEl.querySelector('.dashboard__empty')).toBeNull();
  });

  it('should render correct number of table rows', () => {
    mockService.ranking.set(mockRankingEntries);
    fixture.detectChanges();
    const rows = nativeEl.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should display species names in the table', () => {
    mockService.ranking.set(mockRankingEntries);
    fixture.detectChanges();
    const text = nativeEl.querySelector('tbody')!.textContent!;
    expect(text).toContain('Zorgons');
    expect(text).toContain('Nebulites');
  });

  // ── Last combat result ─────────────────────────────────────────────────────

  it('should show last combat result when available', () => {
    mockService.lastCombatResult.set(mockCombatResult);
    fixture.detectChanges();
    const result = nativeEl.querySelector('.dashboard__last-result');
    expect(result).not.toBeNull();
    expect(result!.textContent).toContain('Zorgons');
    expect(result!.textContent).toContain('Nebulites');
  });

  it('should not show last combat result when null', () => {
    expect(nativeEl.querySelector('.dashboard__last-result')).toBeNull();
  });

  // ── Accessibility tests ─────────────────────────────────────────────────────

  it('should have aria-labelledby on actions section', () => {
    const section = nativeEl.querySelector('.dashboard__actions')!;
    expect(section.getAttribute('aria-labelledby')).toBe('actions-title');
  });

  it('should have aria-live="polite" on empty state', () => {
    const empty = nativeEl.querySelector('.dashboard__empty')!;
    expect(empty.getAttribute('role')).toBe('status');
  });

  it('should have scope on table headers', () => {
    mockService.ranking.set(mockRankingEntries);
    fixture.detectChanges();
    const headers = nativeEl.querySelectorAll('th[scope="col"]');
    expect(headers.length).toBe(4);
  });
});
