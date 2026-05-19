import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../../../core/services/auth.service';
import { signal } from '@angular/core';

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
      imports: [DashboardComponent],
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

  it('should return the first name from user signal', () => {
    expect(component.firstName$()).toBe(mockUser.firstName);
  });

  it('should return display name if first name is not available', () => {

    const userWithoutFirstName = {
      id: 2,
      firstName: undefined,
      email: 'user2@example.com'
    };

    userSignal.set(userWithoutFirstName);

    fixture.detectChanges();

    expect(component.firstName$()).toBe(userWithoutFirstName.email);
  });

});
