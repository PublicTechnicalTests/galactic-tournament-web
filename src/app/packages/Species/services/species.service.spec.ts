import { TestBed } from '@angular/core/testing';
import { SpeciesService } from './species.service';
import { Species } from '../models/species.model';

describe('SpeciesService', () => {
  let service: SpeciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeciesService);
  });

  // ── Unit tests ─────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should seed 12 species on init', () => {
    expect(service.allSpecies().length).toBe(12);
  });

  // ── add() ──────────────────────────────────────────────────────────────────

  it('should add a new species and increase list length', () => {
    service.add({ name: 'Testoids', power: 50, ability: 'Test blast' });
    expect(service.allSpecies().length).toBe(13);
  });

  it('should assign an auto-incremented id', () => {
    const created = service.add({ name: 'Testoids', power: 50, ability: 'Test blast' });
    expect(created.id).toBe(13);
  });

  it('should trim whitespace from name and ability', () => {
    const created = service.add({ name: '  TrimTest  ', power: 10, ability: '  ability  ' });
    expect(created.name).toBe('TrimTest');
    expect(created.ability).toBe('ability');
  });

  it('should set createdAt as an ISO string', () => {
    const created = service.add({ name: 'DateTest', power: 1, ability: 'none' });
    expect(() => new Date(created.createdAt)).not.toThrow();
    expect(created.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  // ── getPage() — search ─────────────────────────────────────────────────────

  it('should return all species when search is empty', () => {
    const result = service.getPage({ search: '', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 50 });
    expect(result.total).toBe(12);
  });

  it('should filter by name (case-insensitive)', () => {
    const result = service.getPage({ search: 'zorg', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 50 });
    expect(result.total).toBe(1);
    expect(result.items[0].name).toBe('Zorgons');
  });

  it('should filter by ability', () => {
    const result = service.getPage({ search: 'plasma', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 50 });
    expect(result.total).toBeGreaterThanOrEqual(1);
  });

  it('should return empty when no match', () => {
    const result = service.getPage({ search: 'xyznonexistent', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 50 });
    expect(result.total).toBe(0);
    expect(result.items.length).toBe(0);
  });

  // ── getPage() — sort ───────────────────────────────────────────────────────

  it('should sort by name ascending', () => {
    const result = service.getPage({ search: '', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 50 });
    const names = result.items.map((s) => s.name);
    expect(names).toEqual([...names].sort());
  });

  it('should sort by name descending', () => {
    const result = service.getPage({ search: '', sortField: 'name', sortDirection: 'desc', page: 1, pageSize: 50 });
    const names = result.items.map((s) => s.name);
    expect(names).toEqual([...names].sort().reverse());
  });

  it('should sort by power ascending', () => {
    const result = service.getPage({ search: '', sortField: 'power', sortDirection: 'asc', page: 1, pageSize: 50 });
    const powers = result.items.map((s) => s.power);
    for (let i = 0; i < powers.length - 1; i++) {
      expect(powers[i]).toBeLessThanOrEqual(powers[i + 1]);
    }
  });

  it('should sort by power descending', () => {
    const result = service.getPage({ search: '', sortField: 'power', sortDirection: 'desc', page: 1, pageSize: 50 });
    const powers = result.items.map((s) => s.power);
    for (let i = 0; i < powers.length - 1; i++) {
      expect(powers[i]).toBeGreaterThanOrEqual(powers[i + 1]);
    }
  });

  // ── getPage() — pagination ─────────────────────────────────────────────────

  it('should paginate: page 1 with pageSize 5 returns 5 items', () => {
    const result = service.getPage({ search: '', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 5 });
    expect(result.items.length).toBe(5);
    expect(result.totalPages).toBe(3);
  });

  it('should paginate: last page may have fewer items', () => {
    const result = service.getPage({ search: '', sortField: 'name', sortDirection: 'asc', page: 3, pageSize: 5 });
    expect(result.items.length).toBe(2);
  });

  it('should clamp page to totalPages when out of range', () => {
    const result = service.getPage({ search: '', sortField: 'name', sortDirection: 'asc', page: 99, pageSize: 5 });
    expect(result.page).toBeLessThanOrEqual(result.totalPages);
  });

  it('should return at least 1 totalPages even when list is empty', () => {
    const result = service.getPage({ search: 'xyznonexistent', sortField: 'name', sortDirection: 'asc', page: 1, pageSize: 10 });
    expect(result.totalPages).toBe(1);
  });

  it('should not mutate the original list when sorting', () => {
    const before = service.allSpecies().map((s) => s.id);
    service.getPage({ search: '', sortField: 'power', sortDirection: 'desc', page: 1, pageSize: 50 });
    const after = service.allSpecies().map((s) => s.id);
    expect(after).toEqual(before);
  });
});
