import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const mockUser = {
    id: 1,
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    headline: 'Developer',
    bio: 'Angular developer',
    targetRole: 'Fullstack Engineer',
    linkedinUrl: 'https://linkedin.com/john',
    githubUrl: 'https://github.com/john',
  };
  const userSignal = signal(mockUser);

  const authServiceMock = {
    user$: userSignal,
  };
  const userServiceMock = {
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        ReactiveFormsModule, 
        CommonModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
    ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form with user values', () => {

    expect(component.profileForm.value).toEqual({
      headline: 'Developer',
      bio: 'Angular developer',
      targetRole: 'Fullstack Engineer',
      linkedinUrl: 'https://linkedin.com/john',
      githubUrl: 'https://github.com/john',
    });
  });
  it('should compute display name', () => {
    expect(component.displayName$()).toContain('John');
  });
  it('should enable editing mode', () => {

    component.startEditing();

    expect(component.isEditing()).toBe(true);
    expect(component.saveSuccess()).toBe(false);
    expect(component.saveError()).toBeNull();
  });
  it('should cancel editing and reset form', () => {
    component.startEditing();
    component.profileForm.patchValue({ headline: 'Changed' });
    component.cancelEditing();

    expect(component.isEditing()).toBe(false);
    expect(component.profileForm.value.headline).toBe('Developer');
  });
  it('should not save if form is invalid', () => {
    component.startEditing();
    component.profileForm.patchValue({ linkedinUrl: 'invalid-url' });
    component.onSave();
    expect(userServiceMock.updateProfile).not.toHaveBeenCalled();
  });
  it('should save profile if form is valid', () => {
    component.startEditing();
    component.profileForm.patchValue({ headline: 'New Headline' });
    userServiceMock.updateProfile.mockReturnValue({
      subscribe: (callbacks: any) => callbacks.next(),
    });
    component.onSave();

    expect(userServiceMock.updateProfile).toHaveBeenCalledWith({
      headline: 'New Headline',
      bio: 'Angular developer',
      targetRole: 'Fullstack Engineer',
      linkedinUrl: 'https://linkedin.com/john',
      githubUrl: 'https://github.com/john',
    });
    expect(component.isSaving()).toBe(false);

    expect(component.saveSuccess()).toBe(true);

    expect(component.isEditing()).toBe(false);
  });
  it('should handle save error', () => {
    component.startEditing();
    userServiceMock.updateProfile.mockReturnValue({
      subscribe: (callbacks: any) => callbacks.error('Save failed'),
    });
    component.onSave();
    expect(component.isSaving()).toBe(false);
    expect(component.saveError()).toBe('Une erreur est survenue. Réessayez.');
  });
  
  it('should trim whitespace in form values before saving', () => {
    component.startEditing();
    component.profileForm.patchValue({ headline: '  New Headline  ' });
    userServiceMock.updateProfile.mockReturnValue({
      subscribe: (callbacks: any) => callbacks.next(),
    });
    component.onSave();

    expect(userServiceMock.updateProfile).toHaveBeenCalledWith({
      headline: 'New Headline',
      bio: 'Angular developer',
      targetRole: 'Fullstack Engineer',
      linkedinUrl: 'https://linkedin.com/john',
      githubUrl: 'https://github.com/john',
    });
  });
});
