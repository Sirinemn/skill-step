import { TestBed } from '@angular/core/testing';

import { LearningLogService } from './learning-log.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LearningLogService', () => {
  let service: LearningLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LearningLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
