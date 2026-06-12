import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from './categories.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoryService } from '../../category/service/category.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  const mockCategories = [
    { id: 1, name: 'Angular', color: '#dd0031' },
    { id: 2, name: 'React', color: '#61dafb' },
  ];
  const mockCategoryService = {
    categories$: signal(mockCategories),
    loadAll: jest
      .fn()
      .mockReturnValue({
        subscribe: (callbacks: any) => callbacks.next(mockCategories),
      }),
    createCategory: jest.fn().mockReturnValue(of({})),
    updateCategory: jest.fn().mockReturnValue(of({})),
    deleteCategory: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CategoriesComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        CommonModule,
      ],
      providers: [{ provide: CategoryService, useValue: mockCategoryService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load categories on init', () => {
    expect(mockCategoryService.loadAll).toHaveBeenCalled();
    expect(component.isLoading$()).toBe(false);
  });
  it('should set error when loadAll fails', () => {
    const errorMessage = 'Load failed';
    mockCategoryService.loadAll.mockReturnValueOnce({
      subscribe: (callbacks: any) =>
        callbacks.error({ error: { message: errorMessage } }),
    });
    component.ngOnInit();
    expect(component.isLoading$()).toBe(false);
    expect(component.error$()).toBe('Impossible de charger les catégories.');
  });
  it('should create category successfully', () => {
    const newCategory = { id: 3, name: 'Vue', color: '#42b883' };
    mockCategoryService.createCategory.mockReturnValueOnce(of(newCategory));
    component.newCategoryName = 'Vue';
    component.onCreate();
    expect(component.isCreating$()).toBe(false);
    expect(component.newCategoryName).toBe('');
    expect(component.success$()).toBe('Catégorie créée !');
  });
  it('should handle create category error', () => {
    const errorMessage = 'Create failed';
    mockCategoryService.createCategory.mockReturnValueOnce(
      throwError(() => ({ error: { message: errorMessage } })),
    );
    component.newCategoryName = 'Vue';
    component.onCreate();
    expect(component.isCreating$()).toBe(false);
    expect(component.error$()).toBe(errorMessage);
  });
  it('should start editing a category', () => {
    const category = mockCategories[0];
    component.startEdit(category);
    expect(component.editingId$()).toBe(category.id);
    expect(component.editName).toBe(category.name);
    expect(component.editColor).toBe(category.color);
  });
  it('should cancel editing', () => {
    component.editingId$.set(1);
    component.cancelEdit();
    expect(component.editingId$()).toBeNull();
    expect(component.editName).toBe('');
    expect(component.editColor).toBe('');
  });
  it('should update category successfully', () => {
    const updatedCategory = {
      id: 1,
      name: 'Angular Updated',
      color: '#dd0031',
    };
    mockCategoryService.updateCategory.mockReturnValueOnce(of(updatedCategory));
    component.editingId$.set(1);
    component.editName = 'Angular Updated';
    component.onUpdate(1);
    expect(component.editingId$()).toBeNull();
    expect(component.success$()).toBe('Catégorie mise à jour !');
  });
  it('should handle update category error', () => {
    const errorMessage = 'Update failed';
    mockCategoryService.updateCategory.mockReturnValueOnce(
      throwError(() => ({ error: { message: errorMessage } })),
    );
    component.editingId$.set(1);
    component.editName = 'Angular Updated';
    component.onUpdate(1);
    expect(component.error$()).toBe(errorMessage);
  });
  it('should not delete category if user cancels', () => {
    window.confirm = jest.fn().mockReturnValue(false);
    component.onDelete(1);
    expect(mockCategoryService.deleteCategory).not.toHaveBeenCalled();
    expect(component.error$()).toBeNull();
  });
});
