import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UpdateProfilePayload } from '../models/updateProfilePayload.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const authServiceMock = {
  setCurrentUser: jest.fn(),
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch user profile', () => {
    const mockUser = { id: 1, name: 'John Doe' };
    service.getProfile().subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${service['baseUrl']}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); // Simule la réponse du backend
  });
  it('should update user profile and call setCurrentUser', () => {
    const payload = { bio: 'dev' } as UpdateProfilePayload;
    const updatedUser = { id: 1, bio: 'dev' };
    service.updateProfile(payload).subscribe(user => {
      expect(user).toEqual(updatedUser);
      expect(authServiceMock.setCurrentUser).toHaveBeenCalledWith(updatedUser);
    });
    const req = httpMock.expectOne(`${service['baseUrl']}/me`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(updatedUser);
  });
  it('should handle error', () => {

    service.getProfile().subscribe({
      next: () => fail('should fail'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(
      `${service['baseUrl']}/me`
    );

    req.flush(
      'Server Error',
      {
        status: 500,
        statusText: 'Server Error'
      }
    );
  });
});
