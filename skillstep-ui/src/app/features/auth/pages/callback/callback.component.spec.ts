import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CallbackComponent } from './callback.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../../../../core/services/auth.service';
describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  const mockAuthService = {
    handleCallback: jest.fn(),
    logout: jest.fn(),
  };
  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: {
        get: jest.fn(),
      },
    },
  };
  const mockToken = 'token123';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle callback with token', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.mockReturnValue(mockToken);
    component.ngOnInit();
    expect(mockAuthService.handleCallback).toHaveBeenCalledWith(mockToken);
  });

  it('should logout if no token', () => {
    mockActivatedRoute.snapshot.queryParamMap.get.mockReturnValue(null);
    component.ngOnInit();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
