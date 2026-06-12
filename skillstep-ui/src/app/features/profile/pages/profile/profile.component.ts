import { Component, computed, DestroyRef, signal } from '@angular/core';
import { getDisplayName } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { UpdateProfilePayload } from '../../../../core/models/updateProfilePayload.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  readonly user$        = computed(() => this.authService.user$());
  readonly displayName$ = computed(() => {
    const u = this.user$();
    return u ? getDisplayName(u) : '';
  });

  // États du composant
  readonly isEditing  = signal(false);
  readonly isSaving   = signal(false);
  readonly saveSuccess = signal(false);
  readonly saveError  = signal<string | null>(null);

  profileForm!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly fb:          FormBuilder,
    private readonly destroyRef:    DestroyRef
  ) {}

  ngOnInit(): void {
    const user = this.user$();
    this.profileForm = this.fb.group({
      headline:    [user?.headline    ?? '', Validators.maxLength(255)],
      bio:         [user?.bio         ?? '', Validators.maxLength(2000)],
      targetRole:  [user?.targetRole  ?? '', Validators.maxLength(150)],
      linkedinUrl: [user?.linkedinUrl ?? '', Validators.pattern('https?://.+')],
      githubUrl:   [user?.githubUrl   ?? '', Validators.pattern('https?://.+')],
    });
  }

  startEditing(): void {
    this.isEditing.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(null);
  }

  cancelEditing(): void {
    // Remet les valeurs originales
    const user = this.user$();
    this.profileForm.patchValue({
      headline:    user?.headline    ?? '',
      bio:         user?.bio         ?? '',
      targetRole:  user?.targetRole  ?? '',
      linkedinUrl: user?.linkedinUrl ?? '',
      githubUrl:   user?.githubUrl   ?? '',
    });
    this.isEditing.set(false);
  }

  onSave(): void {
    if (this.profileForm.invalid || this.isSaving()) return;

    // Normalisation avant envoi à l'API
    const payload = this.buildPayload();
    this.isSaving.set(true);
    this.saveError.set(null);

    this.userService.updateProfile(payload)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.saveSuccess.set(true);
        // Cache le message de succès après 3 secondes
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set('Une erreur est survenue. Réessayez.');
        console.error(err);
      },
    });
  }

  // Construit le payload final normalisé
  private buildPayload(): UpdateProfilePayload {
    const v = this.profileForm.value;
    return {
      headline:    this.normalizeText(v.headline),
      bio:         this.normalizeText(v.bio),
      targetRole:  this.normalizeText(v.targetRole),
      // URLs : trim uniquement — pas de normalisation des espaces internes
      // car une URL ne devrait pas en avoir (la validation Pattern le détecte)
      linkedinUrl: this.normalizeUrl(v.linkedinUrl),
      githubUrl:   this.normalizeUrl(v.githubUrl),
    };
  }
  // Supprime les espaces début/fin ET remplace les espaces multiples internes par un seul espace
  private normalizeText(value: string | null): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    // Si la valeur est vide après trim, on renvoie null
    // → le backend traitera null comme "pas de valeur" (PATCH sémantique)
    if (trimmed.length === 0) return null;
    return trimmed.replace(/\s+/g, ' ');
  }

  // Trim uniquement pour les URLs
  private normalizeUrl(value: string | null): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }

}
