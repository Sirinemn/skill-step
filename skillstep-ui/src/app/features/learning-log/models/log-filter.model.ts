export interface LogFilters {
  categoryId?: number | null;
  from?:       string | null;
  to?:         string | null;
  search?:     string | null;
  page?:       number;
  size?:       number;
}