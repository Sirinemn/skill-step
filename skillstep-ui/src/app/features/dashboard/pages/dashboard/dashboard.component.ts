import { Component, computed } from '@angular/core';
import { getDisplayName } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

interface KpiCard {
  value:   string;
  label:   string;
  color:   string;
  bgLight: string;
  bgDark:  string;
  borderLight: string;
  borderDark:  string;
}

interface RecentLog {
  title:    string;
  date:     string;
  duration: string;
}

interface TopCategory {
  name:       string;
  percentage: number;
  color:      string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private readonly authService: AuthService) {}

  readonly user$        = computed(() => this.authService.user$());
  readonly firstName$   = computed(() => {
    const u = this.user$();
    return u?.firstName ?? getDisplayName(u!);
  });

   // Données mockées — seront remplacées par l'API au Sprint 3
  // dashboard.component.ts — remplacer le tableau kpiCards
  readonly kpiCards: KpiCard[] = [
    {
      value:        '84',
      label:        'Total logs',
      color:        'text-primary-500',
      bgLight:      'bg-primary-50',
      bgDark:       'dark:bg-primary-950',
      borderLight:  'border-primary-100',
      borderDark:   'dark:border-primary-900',
    },
    {
      value:        '1 260 min',
      label:        'Temps appris',
      color:        'text-teal-600',
      bgLight:      'bg-teal-50',
      bgDark:       'dark:bg-teal-950',
      borderLight:  'border-teal-100',
      borderDark:   'dark:border-teal-900',
    },
    {
      value:        '12',
      label:        'Catégories actives',
      color:        'text-orange-500',
      bgLight:      'bg-orange-50',
      bgDark:       'dark:bg-orange-950',
      borderLight:  'border-orange-100',
      borderDark:   'dark:border-orange-900',
    },
    {
      value:        '6 entrées',
      label:        'Cette semaine',
      color:        'text-blue-600',
      bgLight:      'bg-blue-50',
      bgDark:       'dark:bg-blue-950',
      borderLight:  'border-blue-100',
      borderDark:   'dark:border-blue-900',
    },
  ];

  readonly recentLogs: RecentLog[] = [
    { title: 'Configuration de SQLite en Java',      date: "Aujourd'hui", duration: '45 min' },
    { title: 'Sécurisation API avec Spring Security', date: 'Hier',        duration: '60 min' },
    { title: "Création d'un interceptor Angular",    date: '20 avr. 2026', duration: '35 min' },
  ];

  readonly topCategories: TopCategory[] = [
    { name: 'Spring Boot', percentage: 72, color: 'bg-green-500'    },
    { name: 'Angular',     percentage: 54, color: 'bg-primary-500'  },
    { name: 'PostgreSQL',  percentage: 38, color: 'bg-orange-500'   },
    { name: 'DevOps',      percentage: 22, color: 'bg-blue-400'     },
  ];

  // Activité 7 jours — hauteurs des barres en px (mockées)
  readonly activityDays = [
    { day: 'L', height: 40 },
    { day: 'M', height: 65 },
    { day: 'M', height: 30 },
    { day: 'J', height: 80 },
    { day: 'V', height: 55 },
    { day: 'S', height: 15 },
    { day: 'D', height: 25 },
  ];

}
