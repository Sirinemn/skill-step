import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const mockCategories = [
    { id: 1, name: 'Category 1' , color: 'red'},
    { id: 2, name: 'Category 2' , color: 'blue'}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should have an empty categories signal initially', () => {
    expect(service.categories$()).toEqual([]);
  });
  it('should load categories and update signal when loadAll is called', () => {
    service.loadAll().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
      expect(service.categories$()).toEqual(mockCategories);
    });
    const req = httpMock.expectOne(`${service['baseUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
  
  it('should add new category to signal when createCategory is called', () => {
    const newCategory = { id: 3, name: 'Category 3' , color: 'green'};
    service.categories$.set(mockCategories); 
    service.createCategory({ name: 'Category 3' } as any).subscribe(category => {
      expect(category).toEqual(newCategory);
      expect(service.categories$()).toEqual([
        { id: 1, name: 'Category 1' , color: 'red'},
        { id: 2, name: 'Category 2' , color: 'blue'},
        newCategory
      ]);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Category 3' });
    req.flush(newCategory);
  });
  it('should update category in signal when updateCategory is called', () => {
    const updatedCategory = { id: 1, name: 'Updated Category' };
    service.categories$.set(mockCategories);
    service.updateCategory(1, { name: 'Updated Category' } as any).subscribe(category => {
      expect(category).toEqual(updatedCategory);
      expect(service.categories$()).toEqual([
        updatedCategory,
        { id: 2, name: 'Category 2' , color: 'blue'}
      ]);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Updated Category' });
    req.flush(updatedCategory);
  });
  it('should remove category from signal when deleteCategory is called', () => {
    service.categories$.set(mockCategories);
    service.deleteCategory(1).subscribe(() => {
      expect(service.categories$()).toEqual([
        { id: 2, name: 'Category 2' , color: 'blue'}
      ]);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
