import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LearningLogService } from '../../service/learning-log.service';
import { CategoryService } from '../../category/service/category.service';
import { LearningLogRequest } from '../../models/learning-log-request.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-log-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './log-form.component.html',
  styleUrl: './log-form.component.scss'
})
export class LogFormComponent implements OnInit {

  readonly isEditMode$   = signal(false);
  readonly isSaving$     = signal(false);
  readonly error$        = signal<string | null>(null);
  readonly categories$   = computed(() => this.categoryService.categories$());
  readonly editLogId$    = signal<number | null>(null);

  logForm!: FormGroup;
  
  constructor(
    private readonly fb:             FormBuilder,
    private readonly router:         Router,
    private readonly route:          ActivatedRoute,
    private readonly logService:     LearningLogService,
    private readonly categoryService: CategoryService,
    private readonly destroyRef:      DestroyRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.categoryService.loadAll()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();

    // Vérifie si on est en mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode$.set(true);
      this.editLogId$.set(Number(id));
      this.loadLogForEdit(Number(id));
    }
  }

  private initForm(): void {
    this.logForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(255),
      ]],
      description: ['', Validators.maxLength(5000)],
      durationMin: [30, [
        Validators.required,
        Validators.min(1),
        Validators.max(1440),
      ]],
      logDate: [
        new Date().toISOString().split('T')[0], // aujourd'hui par défaut
        Validators.required,
      ],
      resourceUrl: [''],
      categoryId:  [null],
    });
  }
  private loadLogForEdit(id: number): void {
    this.logService.getById(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: log => {
        this.logForm.patchValue({
          title:       log.title,
          description: log.description ?? '',
          durationMin: log.durationMin,
          logDate:     log.logDate,
          resourceUrl: log.resourceUrl ?? '',
          categoryId:  log.category?.id ?? null,
        });
      },
      error: () => this.error$.set('Impossible de charger ce log.'),
    });
  }

  onSubmit(): void {
    if (this.logForm.invalid || this.isSaving$()) return;

    this.isSaving$.set(true);
    this.error$.set(null);

    const payload = this.buildPayload();
    const request = this.isEditMode$()
      ? this.logService.update(this.editLogId$()!, payload)
      : this.logService.create(payload);

    request
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => this.router.navigate(['/journal']),
      error: err => {
        this.isSaving$.set(false);
        this.error$.set(
          err.error?.message ?? 'Une erreur est survenue.'
        );
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/journal']);
  }

  private buildPayload(): LearningLogRequest {
    const v = this.logForm.value;
    return {
      title:       v.title.trim().replace(/\s+/g, ' '),
      description: v.description?.trim() || null,
      durationMin: Number(v.durationMin),
      logDate:     v.logDate,
      resourceUrl: v.resourceUrl?.trim() || null,
      categoryId:  v.categoryId ? Number(v.categoryId) : null,
    };
  }

  // Getter pratiques pour les validations dans le template
  get titleErrors() { return this.logForm.get('title'); }
  get durationErrors() { return this.logForm.get('durationMin'); }
 
  truncateName(name: string, maxLength: number = 40): string {
    return name.length > maxLength
      ? name.substring(0, maxLength) + '...'
      : name;
  }

}
