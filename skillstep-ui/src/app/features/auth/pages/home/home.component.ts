import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  readonly features = [
    {
      icon: '📖', iconBg: 'bg-purple-100',
      title: 'Journal quotidien',
      description: 'Notez vos apprentissages en quelques secondes',
    },
    {
      icon: '📊', iconBg: 'bg-teal-100',
      title: 'Suivi & Statistiques',
      description: 'Visualisez votre progression',
    },
    {
      icon: '📄', iconBg: 'bg-red-100',
      title: 'Rapport recruteur',
      description: 'Générez un PDF professionnel',
    },
    {
      icon: '🔒', iconBg: 'bg-blue-100',
      title: 'Sécurisé & Privé',
      description: 'Vos données sont sécurisées',
    },
  ];

  readonly stats = [
    { value: '2K+',  label: 'Utilisateurs' },
    { value: '15K+', label: 'Apprentissages' },
    { value: '98%',  label: 'Satisfaction' },
  ];

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  onLogin(): void {
    this.authService.loginWithGoogle();
  }
  onGetStarted(): void {
    this.router.navigate(['auth/login']);
  }

}
