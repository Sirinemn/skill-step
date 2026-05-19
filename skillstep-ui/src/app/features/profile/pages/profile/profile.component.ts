import { Component, computed, signal } from '@angular/core';
import { getDisplayName } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

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

    this.isSaving.set(true);
    this.saveError.set(null);

    this.userService.updateProfile(this.profileForm.value).subscribe({
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

}
