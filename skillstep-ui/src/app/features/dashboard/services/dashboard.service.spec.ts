import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardStats } from '../models/dashboard-stats.model';
import { DayActivity } from '../models/day-activity.model'
import { CategoryStats } from '../models/category-stats.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch dashboard stats', () => {
    const dayActivity: DayActivity[] = [{
      day: "23-05-2025",
      date: "16-16-2026",
      totalMinutes: 20,
      logCount: 1
    }];
    const categoryStats : CategoryStats[] = [{
      id: 1,
      name: "Java",
      color: "#FFFF",
      totalMinutes: 30,
      logCount:3,
      percentage: 20
    }]
    const dashboardStatMock : DashboardStats = {
      totalLogs:10,
      totalMinutes:360,
      activeCategories:5,
      logsThisWeek:3,
      streakDays:3,
      activityLast7Days: dayActivity,
      topCategories: categoryStats
    }

    service.loadStats().subscribe( dashboardStat => {
      expect(dashboardStat).toEqual(dashboardStatMock);
    });
    
    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(dashboardStatMock);
  })
});
