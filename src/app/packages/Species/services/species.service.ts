import { Injectable, signal, computed } from '@angular/core';
import {
  Species,
  SpeciesListParams,
  SpeciesPage,
  SpeciesSortField,
  SortDirection,
} from '../models/species.model';

/**
 * SpeciesService
 *
 * Singleton service that manages the in-memory species registry.
 * Exposes signal-based state for reactive consumption in OnPush components.
 *
 * In a production scenario the data operations would delegate to an HTTP layer;
 * the signal API keeps the component interface identical.
 */
@Injectable({ providedIn: 'root' })
export class SpeciesService {
  /** Internal store of all species records. */
  private readonly _species = signal<Species[]>(this.seedData());

  /** Auto-increment counter for new species IDs. */
  private nextId = signal(this.seedData().length + 1);

  // ── Public read signals ──────────────────────────────────────────────────

  /** Full unfiltered species list. */
  readonly allSpecies = this._species.asReadonly();

  // ── CRUD operations ──────────────────────────────────────────────────────

  /**
   * Adds a new species to the store.
   * @param data Partial species without id/createdAt — generated internally.
   * @returns The newly created `Species` record.
   */
  add(data: Pick<Species, 'name' | 'power' | 'ability'>): Species {
    const newSpecies: Species = {
      id: this.nextId(),
      name: data.name.trim(),
      power: data.power,
      ability: data.ability.trim(),
      createdAt: new Date().toISOString(),
    };
    this._species.update((list) => [...list, newSpecies]);
    this.nextId.update((id) => id + 1);
    return newSpecies;
  }

  // ── Query operations ─────────────────────────────────────────────────────

  /**
   * Returns a paginated, filtered and sorted view of the species list.
   * @param params Query parameters: search, sort field/direction, page, pageSize.
   * @returns A `SpeciesPage` snapshot of the current state.
   */
  getPage(params: SpeciesListParams): SpeciesPage {
    const { search, sortField, sortDirection, page, pageSize } = params;

    let filtered = this._species();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.ability.toLowerCase().includes(q)
      );
    }

    filtered = this.sort(filtered, sortField, sortDirection);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page: safePage, pageSize, totalPages };
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  /**
   * Returns a sorted copy of the given array.
   */
  private sort(
    list: Species[],
    field: SpeciesSortField,
    direction: SortDirection
  ): Species[] {
    return [...list].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return direction === 'asc' ? cmp : -cmp;
    });
  }

  /**
   * Returns initial seed data to pre-populate the species list.
   */
  private seedData(): Species[] {
    return [
      { id: 1, name: 'Zorgons', power: 95, ability: 'Plasma blast', createdAt: '2026-01-01T00:00:00.000Z' },
      { id: 2, name: 'Nebulites', power: 78, ability: 'Mind fog', createdAt: '2026-01-02T00:00:00.000Z' },
      { id: 3, name: 'Crystalloids', power: 85, ability: 'Crystal shield', createdAt: '2026-01-03T00:00:00.000Z' },
      { id: 4, name: 'Voidwalkers', power: 92, ability: 'Phase shift', createdAt: '2026-01-04T00:00:00.000Z' },
      { id: 5, name: 'Plasmaroids', power: 70, ability: 'Overload burst', createdAt: '2026-01-05T00:00:00.000Z' },
      { id: 6, name: 'Quantumites', power: 88, ability: 'Quantum entangle', createdAt: '2026-01-06T00:00:00.000Z' },
      { id: 7, name: 'Shadowbeasts', power: 82, ability: 'Dark shroud', createdAt: '2026-01-07T00:00:00.000Z' },
      { id: 8, name: 'Luminarks', power: 76, ability: 'Light pulse', createdAt: '2026-01-08T00:00:00.000Z' },
      { id: 9, name: 'Infernals', power: 91, ability: 'Hellfire', createdAt: '2026-01-09T00:00:00.000Z' },
      { id: 10, name: 'Frostbiters', power: 74, ability: 'Cryo freeze', createdAt: '2026-01-10T00:00:00.000Z' },
      { id: 11, name: 'Stormcallers', power: 83, ability: 'Thunder strike', createdAt: '2026-01-11T00:00:00.000Z' },
      { id: 12, name: 'Gravitons', power: 89, ability: 'Gravity crush', createdAt: '2026-01-12T00:00:00.000Z' },
    ];
  }
}
