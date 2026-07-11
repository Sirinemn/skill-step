import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ReportService } from '../../../../core/services/report.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getDisplayName } from '../../../../core/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type PeriodPreset = 7 | 30 | 90 | 'custom';

@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {

  private readonly reportService = inject(ReportService);
  private readonly authService   = inject(AuthService);
  private readonly destroyRef    = inject(DestroyRef);

  // État
  readonly isGenerating$ = signal(false);
  readonly error$        = signal<string | null>(null);
  readonly reports$      = computed(() => this.reportService.reports$());

  // Sélection période
  selectedPreset: PeriodPreset = 30;
  customFrom = '';
  customTo   = '';

  readonly user$ = computed(() => this.authService.user$());

  readonly presets: { value: PeriodPreset; label: string }[] = [
    { value: 7,        label: '7 derniers jours'  },
    { value: 30,       label: '30 derniers jours' },
    { value: 90,       label: '90 derniers jours' },
    { value: 'custom', label: 'Période personnalisée' },
  ];
  get isCustom(): boolean {
    return this.selectedPreset === 'custom';
  }

  get periodLabel(): string {
    if (this.selectedPreset === 'custom') {
      if (this.customFrom && this.customTo) {
        const from = new Date(this.customFrom)
          .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const to = new Date(this.customTo)
          .toLocaleDateString('fr-FR',
            { day: '2-digit', month: 'short', year: 'numeric' });
        return `${from} — ${to}`;
      }
      return 'Période personnalisée';
    }
    return `${this.selectedPreset} derniers jours`;
  }

  get canGenerate(): boolean {
    if (this.isGenerating$()) return false;
    if (this.selectedPreset === 'custom') {
      return !!(this.customFrom && this.customTo
                && this.customFrom <= this.customTo);
    }
    return true;
  }
  public onGenerate(): void {
    if (!this.canGenerate) return;

    this.isGenerating$.set(true);
    this.error$.set(null);

    const params = this.selectedPreset === 'custom'
      ? { from: this.customFrom, to: this.customTo }
      : { period: this.selectedPreset };

    this.reportService.generate(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob: Blob) => {
          this.isGenerating$.set(false);

          // Téléchargement automatique
          const filename = 
          `skillstep-report-${new Date().toISOString().split('T')[0]}.pdf`;
          this.reportService.downloadBlob(blob, filename);
          // Ajout à l'historique
          this.reportService.addToHistory(blob, this.periodLabel);
        },
        error: (err) => {
          this.isGenerating$.set(false);
          this.error$.set('Une erreur est survenue lors de la génération du rapport.');
          console.error('Report generation error:', err);
        }
      });
  }

  onDownloadFromHistory(report: any): void {
    this.reportService.downloadBlob(report.blob, report.filename);
  }

  getUserName(): string {
    const u = this.user$();
    return u ? getDisplayName(u) : '';
  }
}
