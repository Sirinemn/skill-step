import { AfterViewInit, Component, computed, DestroyRef, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { getDisplayName } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivityDay, KpiCard, RecentLog, TopCategory } from '../../../../core/models/dashboard.model';
import { Chart } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { LearningLogService } from '../../../learning-log/service/learning-log.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { DayActivity } from '../../models/day-activity.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit{

  // ── Références aux canvas Chart.js ──────────────────
  @ViewChild('donutCanvas')
  donutCanvasRef!: ElementRef<HTMLCanvasElement>;

  private donutChart: Chart | null = null;


  constructor(
    private readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
    private readonly logService: LearningLogService,
    private readonly destroyRef: DestroyRef
    
  ) {}

  // ── État ─────────────────────────────────────────────
  readonly stats$     = signal<DashboardStats | null>(null);
  readonly isLoading$ = signal(true);
  readonly error$     = signal<string | null>(null);

  // ── Computed depuis le signal user ──────────────────
  readonly firstName$ = computed(() => {
    const u = this.authService.user$();
    if (!u) return '';
    return u.firstName ?? getDisplayName(u);
  });

  readonly hasLogs$ = computed(() =>
    (this.stats$()?.totalLogs ?? 0) > 0
  );

  // ── KPI cards construites depuis les stats ───────────
  readonly kpiCards$ = computed(() => {
    const s = this.stats$();
    if (!s) return [];
    return [
      {
        value:       s.totalLogs.toString(),
        label:       'Total logs',
        color:       'text-primary-500',
        bgLight:     'bg-primary-50',
        bgDark:      'dark:bg-primary-950',
        borderLight: 'border-primary-100',
        borderDark:  'dark:border-primary-900',
      },
      {
        value:       DashboardService.formatDuration(s.totalMinutes),
        label:       'Temps appris',
        color:       'text-teal-600',
        bgLight:     'bg-teal-50',
        bgDark:      'dark:bg-teal-950',
        borderLight: 'border-teal-100',
        borderDark:  'dark:border-teal-900',
      },
      {
        value:       s.activeCategories.toString(),
        label:       'Catégories actives',
        color:       'text-orange-500',
        bgLight:     'bg-orange-50',
        bgDark:      'dark:bg-orange-950',
        borderLight: 'border-orange-100',
        borderDark:  'dark:border-orange-900',
      },
      {
        value:       `${s.logsThisWeek} entrées`,
        label:       'Cette semaine',
        color:       'text-blue-600',
        bgLight:     'bg-blue-50',
        bgDark:      'dark:bg-blue-950',
        borderLight: 'border-blue-100',
        borderDark:  'dark:border-blue-900',
      },
    ];
  });

  // ── Hauteur max des barres pour normalisation ────────
  readonly maxBarHeight = 80; // px

  getBarHeight(day: DayActivity): number {
    const stats = this.stats$();
    if (!stats) return 0;
    const max = Math.max(
      ...stats.activityLast7Days.map(d => d.totalMinutes), 1
    );
    return Math.round((day.totalMinutes / max) * this.maxBarHeight);
  }

  formatDuration = DashboardService.formatDuration;

  ngOnInit(): void {
    this.dashboardService.loadStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: stats => {
          this.stats$.set(stats);
          this.isLoading$.set(false);
          // Initialise le donut après le rendu
          setTimeout(() => this.initDonutChart(), 0);
        },
        error: () => {
          this.error$.set('Impossible de charger les statistiques.');
          this.isLoading$.set(false);
        },
      });
  }

  ngAfterViewInit(): void {
    // Le chart est initialisé dans ngOnInit après réception des données
  }

  private initDonutChart(): void {
    const stats = this.stats$();
    if (!stats || !this.donutCanvasRef) return;
    if (stats.topCategories.length === 0) return;

    // Détruit le chart existant si on recharge les stats
    if (this.donutChart) {
      this.donutChart.destroy();
    }

    const ctx = this.donutCanvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels:   stats.topCategories.map(c => c.name),
        datasets: [{
          data:            stats.topCategories.map(c => c.totalMinutes),
          backgroundColor: stats.topCategories.map(c => c.color),
          borderWidth:     2,
          borderColor:     'transparent',
          hoverOffset:     4,
        }],
      },
      options: {
        responsive:       true,
        maintainAspectRatio: false,
        cutout:           '70%',        // donut — trou au milieu
        plugins: {
          legend: { display: false },   // on a notre propre légende
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const mins = ctx.raw as number;
                return ` ${ctx.label} — ${DashboardService.formatDuration(mins)}`;
              }
            }
          }
        }
      }
    });
  }

  // Détruire le chart quand le composant est détruit
  ngOnDestroy(): void {
    this.donutChart?.destroy();
  }

}
