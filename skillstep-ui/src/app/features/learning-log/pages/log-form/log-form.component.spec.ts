import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogFormComponent } from './log-form.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../category/service/category.service';
import { LearningLogService } from '../../service/learning-log.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('LogFormComponent', () => {
  let component: LogFormComponent;
  let fixture: ComponentFixture<LogFormComponent>;
  let router: Router;

  const mockLog = {
    id: 1,
    title: 'Angular',
    description: 'Signals',
    durationMin: 60,
    logDate: '2024-01-01',
    resourceUrl: 'https://angular.dev',
    category: { id: 1, name: 'Frontend' },
  };

  const mockCategories = [{ id: 1, name: 'Frontend', color: '#dd0031' }];

  // ✅ Le signal doit être créé UNE seule fois, en dehors des beforeEach
  const categoriesSignal = signal(mockCategories);

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(null),
      },
    },
  };

  const mockLogService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
    getById: jest.fn().mockReturnValue(of(mockLog)),
  };

  // loadAll retourne un Observable valide avec subscribe()
  const mockCategoryService = {
    categories$: categoriesSignal,
    loadAll: jest.fn().mockReturnValue(of(mockCategories)),
  };

  const configureTestingModule = async () => {
    await TestBed.configureTestingModule({
      imports: [
        LogFormComponent,       // standalone component
        ReactiveFormsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute,      useValue: mockActivatedRoute },
        { provide: LearningLogService,  useValue: mockLogService },
        { provide: CategoryService,     useValue: mockCategoryService },
      ],
    }).compileComponents();
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    //Reset le paramMap en mode création par défaut
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);

    //Restaurer les mocks après un mockReturnValueOnce
    mockLogService.create.mockReturnValue(of({}));
    mockLogService.update.mockReturnValue(of({}));
    mockCategoryService.loadAll?.mockReturnValue?.(of(mockCategories));

    await configureTestingModule();

    fixture = TestBed.createComponent(LogFormComponent);
    component = fixture.componentInstance;

    //On espionne le vrai Router injecté
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.logForm).toBeTruthy();
    expect(component.logForm.get('durationMin')?.value).toBe(30);
    expect(component.logForm.get('title')?.value).toBe('');
  });

  it('should load categories on init', () => {
    expect(mockCategoryService.loadAll).toHaveBeenCalled();
  });

  it('should expose categories from service', () => {
    expect(component.categories$()).toEqual(mockCategories);
  });

  // --- Validation ---

  it('should be invalid when title is empty', () => {
    component.logForm.patchValue({ title: '' });
    expect(component.logForm.invalid).toBe(true);
  });

  it('should be valid with required fields filled', () => {
    component.logForm.patchValue({
      title: 'Angular',
      durationMin: 60,
      logDate: '2024-01-01',
    });
    expect(component.logForm.valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.logForm.patchValue({ title: '' });
    component.onSubmit();
    expect(mockLogService.create).not.toHaveBeenCalled();
  });

  // --- Navigation ---

  it('should navigate to /journal on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/journal']);
  });

  // --- Mode création ---

  it('should call create and navigate on valid submit', () => {
    component.logForm.patchValue({
      title: ' Angular   Signals ',
      description: ' Test ',
      durationMin: 90,
      logDate: '2024-01-01',
      resourceUrl: ' https://angular.dev ',
      categoryId: '1',
    });

    component.onSubmit();

    expect(mockLogService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/journal']);
  });

  it('should set error$ when create fails', () => {
    mockLogService.create.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Erreur création' } }))
    );

    component.logForm.patchValue({
      title: 'Angular',
      durationMin: 60,
      logDate: '2024-01-01',
    });

    component.onSubmit();

    expect(component.error$()).toBe('Erreur création');
  });

  it('should reset isSaving$ to false when create fails', () => {
    mockLogService.create.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Erreur' } }))
    );

    component.logForm.patchValue({
      title: 'Angular',
      durationMin: 60,
      logDate: '2024-01-01',
    });

    component.onSubmit();

    expect(component.isSaving$()).toBe(false);
  });

  // --- Getters template ---

  it('should expose title control via titleErrors', () => {
    expect(component.titleErrors).toBe(component.logForm.get('title'));
  });

  it('should expose durationMin control via durationErrors', () => {
    expect(component.durationErrors).toBe(component.logForm.get('durationMin'));
  });

  // --- Mode édition ---

  describe('edit mode', () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      //Simuler un id dans l'URL
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');

      mockLogService.create.mockReturnValue(of({}));
      mockLogService.update.mockReturnValue(of({}));
      mockLogService.getById.mockReturnValue(of(mockLog));
      mockCategoryService.loadAll.mockReturnValue(of(mockCategories));

      //Reconfigurer le module avec le nouveau paramMap
      await TestBed.resetTestingModule();
      await configureTestingModule();

      fixture = TestBed.createComponent(LogFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set isEditMode$ to true', () => {
      expect(component.isEditMode$()).toBe(true);
    });

    it('should set editLogId$ from route param', () => {
      expect(component.editLogId$()).toBe(1);
    });

    it('should call getById with the correct id', () => {
      expect(mockLogService.getById).toHaveBeenCalledWith(1);
    });

    it('should patch form with loaded log data', () => {
      expect(component.logForm.value.title).toBe('Angular');
      expect(component.logForm.value.durationMin).toBe(60);
    });

    it('should set error$ when update fails', () => {
      mockLogService.update.mockReturnValueOnce(
        throwError(() => ({ error: { message: 'Erreur update' } }))
      );

      component.logForm.patchValue({
        title: 'Angular',
        durationMin: 60,
        logDate: '2024-01-01',
      });

      component.onSubmit();

      expect(component.error$()).toBe('Erreur update');
    });

    it('should set error$ when getById fails', () => {
      // Recréer le composant avec getById en erreur
      mockLogService.getById.mockReturnValueOnce(
        throwError(() => new Error('Not found'))
      );

      fixture = TestBed.createComponent(LogFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.error$()).toBe('Impossible de charger ce log.');
    });
  });
});
