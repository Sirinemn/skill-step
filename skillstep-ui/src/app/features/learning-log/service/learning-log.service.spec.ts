import { TestBed } from '@angular/core/testing';

import { LearningLogService } from './learning-log.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LearningLog } from '../models/learning-log.model';
import { Page } from '../models/page.model';
import { Category } from '../category/models/category.model';
import { LearningLogRequest } from '../models/learning-log-request.model';

describe('LearningLogService', () => {
  let service: LearningLogService;
  let httpMock: HttpTestingController;
  const category: Category = {
    id: 1,
    name: 'Category 1',
    color: 'red'
  };
  const learningLogRequest: LearningLogRequest = {
    title: 'Test Log',
    description: 'Description du test',
    categoryId: 1,
    durationMin: 60,
    logDate: new Date().toISOString(),
    resourceUrl: null
  };
  const logFilters = {
    categoryId: 1,
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // il y a une semaine
    to: new Date().toISOString(),
    search: 'Test',
    page: 0,
    size: 10
  };
  const learningLog: LearningLog = {
    id: 1,
    title: 'Test Log',
    description: 'Description du test',
    durationMin: 60,
    logDate: new Date().toISOString(),
    resourceUrl: null,
    category: category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LearningLogService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch all learning logs with filters', () => {
    const pageLearningLog: Page<LearningLog> = {
      content: [learningLog],
      totalPages: 1,
      number: 0,
      size: 10,
      totalElements: 1
    };
    service.getAll(logFilters).subscribe(learningLogs => {
      expect(learningLogs).toEqual(pageLearningLog);
      expect(service.totalLogs$()).toBe(1);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?categoryId=${logFilters.categoryId}&from=${logFilters.from}&to=${logFilters.to}&search=Test&page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(pageLearningLog);
  });

  it('should fetch a learning log by ID', () => {
    service.getById(1).subscribe(learningLog => {
      expect(learningLog).toEqual(learningLog);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(learningLog);   
  });
  it('should create a new learning log', () => {
    service.create(learningLogRequest).subscribe(learningLog => {
      expect(learningLog).toEqual(learningLog);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(learningLog);
  });
  it('should update an existing learning log', () => {
    service.update(1, learningLogRequest).subscribe(learningLog => {
      expect(learningLog).toEqual(learningLog);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(learningLog);
  });
  it('should delete a learning log', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeUndefined();
    }); 

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
