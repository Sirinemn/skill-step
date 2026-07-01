import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ReportService } from '../../../../core/services/report.service';
import { AuthService } from '../../../../core/services/auth.service';

type PeriodPreset = 7 | 30 | 90 | 'custom';

@Component({
  selector: 'app-report',
  imports: [],
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


}
