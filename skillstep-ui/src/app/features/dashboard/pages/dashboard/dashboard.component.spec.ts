import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import localeFr from '@angular/common/locales/fr';
import { AuthService } from '../../../../core/services/auth.service';
import { DestroyRef, LOCALE_ID, signal } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { DayActivity } from '../../models/day-activity.model';
import { CategoryStats } from '../../models/category-stats.model';
import { DashboardService } from '../../services/dashboard.service';
import { LearningLogService } from '../../../learning-log/service/learning-log.service';
import { registerLocaleData } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

registerLocaleData(localeFr);
describe('DashboardComponent', () => {
  const dayActivity: DayActivity[] = [{
        day: "2026-01-16",
        date: "2026-01-16",
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
  const mockActivatedRoute = {
    snapshot: {
      queryParams: {},
    },
  };

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    firstName: 'User',
    lastName: 'Example',
  };

  let userSignal = signal(mockUser);
  const authServiceMock = {
    user$: userSignal,
  };
  let dashboardServiceMock = {
    loadStats: jest.fn().mockReturnValue(of(dashboardStatMock)),
    formatDuration: jest.fn((m: number) => `${m} min`),
  }
  const logServiceMock = {};

  const destroyRefMock = {};
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: LearningLogService, useValue: logServiceMock },
        { provide: DestroyRef, useValue: destroyRefMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LOCALE_ID, useValue: 'fr' }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard stats on init', () => {
    expect(dashboardServiceMock.loadStats).toHaveBeenCalled();

    expect(component.stats$()).toEqual(dashboardStatMock);
    expect(component.isLoading$()).toBe(false);
  });
  it('should compute firstName from user', () => {
    expect(component.firstName$()).toBe('User');
  });
  it('should detect hasLogs', () => {
    expect(component.hasLogs$()).toBe(true);
  });
  it('should compute KPI cards', () => {
    const cards = component.kpiCards$();

    expect(cards.length).toBe(4);
    expect(cards[0].label).toBe('Total logs');
  });

  it('should calculate bar height', () => {
    const result = component.getBarHeight(dayActivity[0]);

    expect(result).toBeGreaterThanOrEqual(0);
  });

});
