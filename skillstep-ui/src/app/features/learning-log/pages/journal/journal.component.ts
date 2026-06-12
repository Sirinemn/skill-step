import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { LogFilters } from '../../models/log-filter.model';
import { LearningLog } from '../../models/learning-log.model';
import { LearningLogService } from '../../service/learning-log.service';
import { CategoryService } from '../../category/service/category.service';
import { Page } from '../../models/page.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-journal',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss'
})
export class JournalComponent implements OnInit {

  // État
  readonly logs$       = signal<LearningLog[]>([]);
  readonly categories$ = computed(() => this.categoryService.categories$());
  readonly isLoading$  = signal(true);
  readonly error$      = signal<string | null>(null);

  // Pagination
  readonly currentPage$  = signal(0);
  readonly totalPages$   = signal(0);
  readonly totalElements$ = signal(0);
  readonly pageSize = 10;

  // Filtres
  readonly filters$ = signal<LogFilters>({
    page: 0,
    size: this.pageSize,
  });

  // Formulaire filtres (two-way binding)
  searchText    = '';
  selectedCatId = '';
  dateFrom      = '';
  dateTo        = '';

  constructor(
    private readonly logService:      LearningLogService,
    private readonly categoryService: CategoryService,
    private readonly destroyRef:      DestroyRef
  ) {}

  ngOnInit(): void {
    // Charge catégories et logs en parallèle
    this.categoryService.loadAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();

    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading$.set(true);
    this.error$.set(null);

    this.logService.getAll(this.filters$())  
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (page: Page<LearningLog>) => {
        this.logs$.set(page.content);
        this.totalPages$.set(page.totalPages);
        this.totalElements$.set(page.totalElements);
        this.currentPage$.set(page.number);
        this.isLoading$.set(false);
      },
      error: () => {
        this.error$.set('Erreur lors du chargement des logs.');
        this.isLoading$.set(false);
      },
    });
  }

  applyFilters(): void {
    this.filters$.update(f => ({
      ...f,
      search:     this.searchText     || null,
      categoryId: this.selectedCatId
                    ? Number(this.selectedCatId)
                    : null,
      from: this.dateFrom || null,
      to:   this.dateTo   || null,
      page: 0, // reset à la première page
    }));
    this.loadLogs();
  }

  resetFilters(): void {
    this.searchText    = '';
    this.selectedCatId = '';
    this.dateFrom      = '';
    this.dateTo        = '';
    this.filters$.set({ page: 0, size: this.pageSize });
    this.loadLogs();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages$()) return;
    this.filters$.update(f => ({ ...f, page }));
    this.loadLogs();
  }

  onDelete(id: number): void {
    if (!confirm('Supprimer cet apprentissage ?')) return;
    this.logService.delete(id)  
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.loadLogs(),
      error: () => this.error$.set('Erreur lors de la suppression.'),
    });
  }

  formatDuration(min: number): string {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString())     return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

}
