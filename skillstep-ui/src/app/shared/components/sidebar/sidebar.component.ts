import { Component, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { getDisplayName } from '../../../core/models/user.model';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon:  string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',   route: '/dashboard', icon: '▦'  },
    { label: 'Journal',     route: '/journal',   icon: '📓' },
    { label: 'Catégories',  route: '/categories',icon: '🏷️' },
    { label: 'Rapport PDF', route: '/report',    icon: '📄' },
    { label: 'Profil',      route: '/profile',   icon: '👤' },
  ];

  readonly user$        = computed(() => this.authService.user$());
  readonly displayName$ = computed(() => {
    const u = this.user$();
    return u ? getDisplayName(u) : '';
  });

  constructor(private readonly authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
