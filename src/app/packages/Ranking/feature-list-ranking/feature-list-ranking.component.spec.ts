import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal, computed } from '@angular/core';
import { vi } from 'vitest';

import { FeatureListRankingComponent } from './feature-list-ranking.component';
import { TournamentService } from '../../Dashboard/services/tournament.service';
import { RankingEntry } from '../../Dashboard/models/ranking.model';

const MOCK_RANKING: RankingEntry[] = [
  { speciesId: 1, speciesName: 'Zorgons',      wins: 7, losses: 0, points: 21 },
  { speciesId: 2, speciesName: 'Nebulites',    wins: 6, losses: 1, points: 18 },
  { speciesId: 3, speciesName: 'Crystalloids', wins: 5, losses: 2, points: 15 },
  { speciesId: 4, speciesName: 'Voidwalkers',  wins: 4, losses: 3, points: 12 },
];

function buildMockService(entries: RankingEntry[] = [], simulating = false) {
  const _entries = signal(entries);
  return {
    ranking:          computed(() => _entries()),
    isSimulating:     signal(simulating),
    simulateTournament: vi.fn(),
    simulateCombat:     vi.fn(),
  };
}

describe('FeatureListRankingComponent', () => {
  let component: FeatureListRankingComponent;
  let fixture: ComponentFixture<FeatureListRankingComponent>;
  let nativeEl: HTMLElement;
  let mockService: ReturnType<typeof buildMockService>;

  async function setup(entries: RankingEntry[] = [], simulating = false) {
    mockService = buildMockService(entries, simulating);

    await TestBed.configureTestingModule({
      imports: [FeatureListRankingComponent, TranslateModule.forRoot()],
      providers: [{ provide: TournamentService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureListRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement as HTMLElement;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  it('should create the component', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should render the page header', async () => {
    await setup();
    expect(nativeEl.querySelector('.feature-list-ranking__header')).not.toBeNull();
  });

  it('should render Simulate Tournament and Simulate Combat buttons', async () => {
    await setup();
    const buttons = nativeEl.querySelectorAll<HTMLButtonElement>('.btn');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  it('should show empty state when ranking is empty', async () => {
    await setup([]);
    expect(nativeEl.querySelector('.feature-list-ranking__empty')).not.toBeNull();
    expect(nativeEl.querySelector('.ranking-table')).toBeNull();
  });

  it('empty state should have role="status"', async () => {
    await setup([]);
    const emptyEl = nativeEl.querySelector('.feature-list-ranking__empty')!;
    expect(emptyEl.getAttribute('role')).toBe('status');
  });

  // ── With data ──────────────────────────────────────────────────────────────

  it('should render ranking table when entries exist', async () => {
    await setup(MOCK_RANKING);
    expect(nativeEl.querySelector('.ranking-table')).not.toBeNull();
    expect(nativeEl.querySelector('.feature-list-ranking__empty')).toBeNull();
  });

  it('should render a row for each ranking entry', async () => {
    await setup(MOCK_RANKING);
    const rows = nativeEl.querySelectorAll('.ranking-table tbody tr');
    expect(rows.length).toBe(MOCK_RANKING.length);
  });

  it('first row should contain first species name', async () => {
    await setup(MOCK_RANKING);
    const firstRow = nativeEl.querySelector('.ranking-table tbody tr')!;
    expect(firstRow.textContent).toContain('Zorgons');
  });

  it('podium rows (top 3) should have --podium modifier', async () => {
    await setup(MOCK_RANKING);
    const podiumRows = nativeEl.querySelectorAll('.ranking-table__row--podium');
    expect(podiumRows.length).toBe(3);
  });

  // ── Simulating state ───────────────────────────────────────────────────────

  it('should show status message while simulating', async () => {
    await setup([], true);
    expect(nativeEl.querySelector('.feature-list-ranking__status')).not.toBeNull();
  });

  it('status element should have role="status" and aria-live="polite"', async () => {
    await setup([], true);
    const statusEl = nativeEl.querySelector('.feature-list-ranking__status')!;
    expect(statusEl.getAttribute('role')).toBe('status');
    expect(statusEl.getAttribute('aria-live')).toBe('polite');
  });

  it('buttons should be disabled while simulating', async () => {
    await setup([], true);
    const buttons = nativeEl.querySelectorAll<HTMLButtonElement>('.btn');
    buttons.forEach((btn) => expect(btn.disabled).toBe(true));
  });

  // ── Actions ────────────────────────────────────────────────────────────────

  it('should call simulateTournament() on tournament button click', async () => {
    await setup();
    const btn = nativeEl.querySelector<HTMLButtonElement>('.btn--primary')!;
    btn.click();
    expect(mockService.simulateTournament).toHaveBeenCalledOnce();
  });

  it('should call simulateCombat() on combat button click', async () => {
    await setup();
    const btn = nativeEl.querySelector<HTMLButtonElement>('.btn--secondary')!;
    btn.click();
    expect(mockService.simulateCombat).toHaveBeenCalledOnce();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('table section should have role="region" with aria-label', async () => {
    await setup(MOCK_RANKING);
    const region = nativeEl.querySelector('[role="region"]')!;
    expect(region).not.toBeNull();
    expect(region.getAttribute('aria-label')).toBeTruthy();
  });

  it('table headers should have scope="col"', async () => {
    await setup(MOCK_RANKING);
    const ths = nativeEl.querySelectorAll<HTMLTableCellElement>('th');
    ths.forEach((th) => expect(th.getAttribute('scope')).toBe('col'));
  });

  it('action group should have aria-label', async () => {
    await setup();
    const group = nativeEl.querySelector('[role="group"]')!;
    expect(group.getAttribute('aria-label')).toBeTruthy();
  });
});
