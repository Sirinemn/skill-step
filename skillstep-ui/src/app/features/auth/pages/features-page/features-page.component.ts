import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface Feature {
  icon:        string;
  iconBg:      string;
  title:       string;
  description: string;
  details:     string[];
}
@Component({
  selector: 'app-features-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './features-page.component.html',
  styleUrl: './features-page.component.scss'
})
export class FeaturesPageComponent {

  readonly features: Feature[] = [
    {
      icon:    '📖',
      iconBg:  'bg-purple-100',
      title:   'Journal quotidien',
      description: 'Enregistrez chaque apprentissage en quelques secondes.',
      details: [
        'Titre, description et durée',
        'Catégories personnalisées',
        'Lien vers la ressource utilisée',
        'Recherche et filtres avancés',
      ],
    },
    {
      icon:    '📊',
      iconBg:  'bg-teal-100',
      title:   'Suivi & Statistiques',
      description: 'Visualisez votre progression avec des graphiques clairs.',
      details: [
        'Streak de jours consécutifs',
        'Temps total investi',
        'Top catégories',
        'Activité hebdomadaire',
      ],
    },
    {
      icon:    '📄',
      iconBg:  'bg-red-100',
      title:   'Rapport recruteur PDF',
      description: 'Générez un rapport professionnel prêt à partager.',
      details: [
        'Période personnalisable',
        'Design soigné type portfolio',
        'Profil + apprentissages + stats',
        'Téléchargeable en un clic',
      ],
    },
    {
      icon:    '🔒',
      iconBg:  'bg-blue-100',
      title:   'Sécurisé & Privé',
      description: 'Vos données vous appartiennent, toujours.',
      details: [
        'Connexion via Google OAuth2',
        'Données chiffrées',
        'Aucune publicité',
        'Export de vos données',
      ],
    },
  ];

  constructor(private readonly authService: AuthService) {}

  onLogin(): void {
    this.authService.loginWithGoogle();
  }

}
