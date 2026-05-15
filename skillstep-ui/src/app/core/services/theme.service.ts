import { computed, effect, Injectable, signal } from '@angular/core';
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Signal — état réactif du thème
  // On lit le thème sauvegardé, sinon on suit le système
  private readonly theme$ = signal<Theme>(this.getInitialTheme());

  // Computed public — les composants lisent ça
  readonly isDark$    = computed(() => this.theme$() === 'dark');
  readonly current$   = computed(() => this.theme$());

  constructor() { 
    // Effect — se déclenche automatiquement quand theme$ change
    // Met à jour la classe 'dark' sur <html> ET sauvegarde en localStorage
    effect(() => {
      const isDark = this.isDark$();
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('skillstep_theme', this.theme$());
    });
  }

  toggle(): void {
    this.theme$.update(t => t === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme$.set(theme);
  }

  private getInitialTheme(): Theme {
    // 1. Thème sauvegardé par l'utilisateur
    const saved = localStorage.getItem('skillstep_theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;

    // 2. Thème système (macOS/Windows/Android)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
