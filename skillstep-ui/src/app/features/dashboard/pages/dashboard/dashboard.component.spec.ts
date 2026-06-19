import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../../../core/services/auth.service';
import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardComponent', () => {

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    firstName: 'User',
    lastName: 'Example',
  };

  let userSignal: any;

  let authServiceMock: any;

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {

    userSignal = signal(mockUser);

    authServiceMock = {
      user$: userSignal,
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
