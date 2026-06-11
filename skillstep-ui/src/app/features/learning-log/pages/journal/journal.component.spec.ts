import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalComponent } from './journal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CategoryService } from '../../category/service/category.service';
import { LearningLogService } from '../../service/learning-log.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

describe('JournalComponent', () => {
  let component: JournalComponent;
  let fixture: ComponentFixture<JournalComponent>;
  const mockLogs = [
    {
      id: 1,
      title: 'Log 1',
      description: 'Description 1',
      duration: 60,
      date: '2024-01-01',
    },
  ];
  const mockCategories = [
    {
      id: 1,
      name: 'Category 1',
      color: '#ff0000',
    },
  ];
  const mockPage = {
    content: mockLogs,
    totalPages: 1,
    totalElements: 1,
    number: 0,
  };
  const mockLogService = {
    getAll: jest.fn().mockReturnValue(of(mockPage)),
    delete: jest.fn().mockReturnValue(of({})),
  };
  const mockCategoryService = {
    categories$: signal(mockCategories),
    loadAll: jest.fn().mockReturnValue(of(mockCategories)),
  };
  const mockActivatedRoute = {
    snapshot: {
      queryParams: {},
    },
  };

  beforeEach(async () => {
    mockLogService.getAll.mockReturnValue(of(mockPage));
    mockLogService.delete.mockReturnValue(of({}));

    mockCategoryService.loadAll.mockReturnValue(of(mockCategories));
    await TestBed.configureTestingModule({
      imports: [JournalComponent, 
        HttpClientTestingModule,
      ],
      providers: [
        { provide: LearningLogService, useValue: mockLogService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
   afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load logs on init', () => {
    expect(mockCategoryService.loadAll).toHaveBeenCalled();
    expect(mockLogService.getAll).toHaveBeenCalled();
    expect(component.logs$()).toEqual(mockLogs);
    expect(component.categories$()).toEqual(mockCategories);
  });
  it('should set error when loading logs fails', () => {
    mockLogService.getAll.mockReturnValueOnce(
      throwError(() => new Error())
    );

    component.loadLogs();

    expect(component.error$()).toBe(
      'Erreur lors du chargement des logs.'
    );

    expect(component.isLoading$()).toBe(false);
  });
  it('should apply filters and reload logs', () => {
    const spy = jest.spyOn(component, 'loadLogs');

    component.searchText = 'Angular';
    component.selectedCatId = '1';
    component.dateFrom = '2024-01-01';
    component.dateTo = '2024-01-31';

    component.applyFilters();

    expect(component.filters$()).toEqual({
      page: 0,
      size: 10,
      search: 'Angular',
      categoryId: 1,
      from: '2024-01-01',
      to: '2024-01-31',
    });

    expect(spy).toHaveBeenCalled();
  });
 it('should reset filters and reload logs', () => {
    const spy = jest.spyOn(component, 'loadLogs');
    component.searchText = 'Angular';
    component.selectedCatId = '1';
    component.dateFrom = '2024-01-01';
    component.dateTo = '2024-01-31';
    component.resetFilters();
    expect(component.searchText).toBe('');
    expect(component.selectedCatId).toBe('');
    expect(component.dateFrom).toBe('');
    expect(component.dateTo).toBe('');
    expect(component.filters$()).toEqual({ page: 0, size: 10 });
    expect(spy).toHaveBeenCalled();
  });
   it('should go to page', () => {
    const spy = jest.spyOn(component, 'loadLogs');

    component.totalPages$.set(5);

    component.goToPage(2);

    expect(component.filters$().page).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it('should not go to invalid page', () => {
    const spy = jest.spyOn(component, 'loadLogs');

    component.totalPages$.set(5);

    component.goToPage(-1);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should delete log and reload list', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    const spy = jest.spyOn(component, 'loadLogs');

    component.onDelete(1);

    expect(mockLogService.delete).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should not delete when confirm returns false', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.onDelete(1);

    expect(mockLogService.delete).not.toHaveBeenCalled();
  });

  it('should set error when delete fails', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    mockLogService.delete.mockReturnValueOnce(
      throwError(() => new Error())
    );

    component.onDelete(1);

    expect(component.error$()).toBe(
      'Erreur lors de la suppression.'
    );
  });

  it('should format duration in minutes', () => {
    expect(component.formatDuration(45)).toBe('45 min');
  });

  it('should format duration in hours and minutes', () => {
    expect(component.formatDuration(90)).toBe('1h 30min');
  });

  it('should format duration in hours only', () => {
    expect(component.formatDuration(120)).toBe('2h');
  });

  it('should format today date', () => {
    const today = new Date().toISOString();

    expect(component.formatDate(today))
      .toBe("Aujourd'hui");
  });

  it('should format yesterday date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    expect(component.formatDate(yesterday.toISOString()))
      .toBe('Hier');
  });
});
