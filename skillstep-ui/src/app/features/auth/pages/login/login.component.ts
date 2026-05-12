import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  currentYear: number = new Date().getFullYear();

  readonly features = [
    {
      icon:        '📖',
      iconBg:      'bg-purple-100',
      iconColor:   'text-purple-600',
      title:       'Journal quotidien',
      description: 'Notez vos apprentissages en quelques secondes',
    },
    {
      icon:        '📊',
      iconBg:      'bg-teal-100',
      iconColor:   'text-teal-600',
      title:       'Suivi & Statistiques',
      description: 'Visualisez votre progression',
    },
    {
      icon:        '📄',
      iconBg:      'bg-red-100',
      iconColor:   'text-red-500',
      title:       'Rapport recruteur',
      description: 'Générez un PDF professionnel',
    },
    {
      icon:        '🔒',
      iconBg:      'bg-blue-100',
      iconColor:   'text-blue-500',
      title:       'Sécurisé & Privé',
      description: 'Vos données sont sécurisées',
    },
  ];

  readonly stats = [
    { value: '2K+',  label: 'Utilisateurs' },
    { value: '15K+', label: 'Apprentissages' },
    { value: '98%',  label: 'Satisfaction' },
  ];

  constructor(private readonly authService: AuthService) {}

  onLoginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

}
