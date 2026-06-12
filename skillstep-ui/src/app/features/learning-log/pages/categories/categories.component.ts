import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../category/service/category.service';
import { ColorPalette } from '../../../../core/utils/color-palette';
import { Category } from '../../category/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  readonly categories$  = computed(() => this.categoryService.categories$());
  readonly isLoading$   = signal(true);
  readonly error$       = signal<string | null>(null);
  readonly success$     = signal<string | null>(null);

  // Formulaire création
  newCategoryName  = '';
  isCreating$      = signal(false);

  // Édition inline
  editingId$       = signal<number | null>(null);
  editName         = '';
  editColor        = '';

  readonly availableColors: string[] = ColorPalette.colors;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly destroyRef: DestroyRef

  ) {}

  ngOnInit(): void {
    this.categoryService.loadAll().subscribe({
      next:  () => this.isLoading$.set(false),
      error: () => {
        this.isLoading$.set(false);
        this.error$.set('Impossible de charger les catégories.');
      },
    });
  }

  onCreate(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;

    this.isCreating$.set(true);
    this.error$.set(null);

    this.categoryService.createCategory({ name, color: null })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.newCategoryName = '';
        this.isCreating$.set(false);
        this.showSuccess('Catégorie créée !');
      },
      error: err => {
        this.isCreating$.set(false);
        this.error$.set(
          err.error?.message ?? 'Erreur lors de la création.'
        );
      },
    });
  }

  startEdit(cat: Category): void {
    this.editingId$.set(cat.id);
    this.editName  = cat.name;
    this.editColor = cat.color;
  }

  cancelEdit(): void {
    this.editingId$.set(null);
  }

  onUpdate(id: number): void {
    const name = this.editName.trim();
    if (!name) return;

    this.categoryService.updateCategory(id, {
      name,
      color: this.editColor,
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.editingId$.set(null);
        this.showSuccess('Catégorie mise à jour !');
      },
      error: err => {
        this.error$.set(
          err.error?.message ?? 'Erreur lors de la mise à jour.'
        );
      },
    });
  }

  onDelete(id: number): void {
    if (!confirm('Supprimer cette catégorie ?')) return;

    this.categoryService.deleteCategory(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next:  () => this.showSuccess('Catégorie supprimée.'),
      error: err => {
        this.error$.set(
          err.error?.message ??
          'Impossible de supprimer — des logs utilisent peut-être cette catégorie.'
        );
      },
    });
  }

  private showSuccess(msg: string): void {
    this.success$.set(msg);
    setTimeout(() => this.success$.set(null), 3000);
  }

}
