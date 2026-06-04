// Réponse paginée Spring — correspond à Page<T>
export interface Page<T> {
  content:       T[];
  totalElements: number;
  totalPages:    number;
  number:        number;  // page courante (0-indexed)
  size:          number;
}