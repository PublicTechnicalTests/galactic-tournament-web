/**
 * Represents a galactic species entity.
 */
export interface Species {
  /** Auto-incremented unique identifier. */
  id: number;
  /** Species display name (max 100 chars). */
  name: string;
  /** Combat power level. */
  power: number;
  /** Special ability description (max 255 chars). */
  ability: string;
  /** ISO timestamp of record creation. */
  createdAt: string;
}

/**
 * Possible sort directions for the species table.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Columns available for sorting in the species table.
 */
export type SpeciesSortField = 'name' | 'power' | 'ability' | 'createdAt';

/**
 * Parameters for filtering, sorting and paginating the species list.
 */
export interface SpeciesListParams {
  search: string;
  sortField: SpeciesSortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

/**
 * Paginated result wrapper for species queries.
 */
export interface SpeciesPage {
  items: Species[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
