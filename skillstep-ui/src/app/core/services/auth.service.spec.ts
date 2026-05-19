import { TestBed }                from '@angular/core/testing';
import { HttpClientTestingModule,
         HttpTestingController }  from '@angular/common/http/testing';
import { Router }                 from '@angular/router';
import { AuthService }            from './auth.service';
import { User }                   from '../models/user.model';

// Mock du Router pour éviter la navigation réelle dans les tests
const routerMock = {
  navigate: jest.fn(),
};

const mockUser: User = {
  id:          1,
  email:       'joe@example.com',
  firstName:   'Joe',
  lastName:    'Doe',
  avatarUrl:   null,
  headline:    null,
  bio:         null,
  targetRole:  null,
  linkedinUrl: null,
  githubUrl:   null,
};

describe('AuthService', () => {

  let service:    AuthService;
  let httpMock:   HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports:   [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
      ],
    });

    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes HTTP non gérées
    httpMock.verify();
  });

  it('doit être créé', () => {
    expect(service).toBeTruthy();
  });

  it('doit démarrer non authentifié si pas de token', () => {
    expect(service.isAuthenticated$()).toBe(false);
    expect(service.user$()).toBeNull();
  });

  it('doit sauvegarder le token et récupérer le profil lors du callback', () => {
    service.handleCallback('fake-jwt-token');

    // Intercepte la requête GET /auth/me
    const req = httpMock.expectOne('http://localhost:8080/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); // Simule la réponse de l'API

    expect(service.user$()).toEqual(mockUser);
    expect(service.isAuthenticated$()).toBe(true);
    expect(localStorage.getItem('skillstep_jwt')).toBe('fake-jwt-token');
  });

  it('doit nettoyer le token et l\'utilisateur lors du logout', () => {
    // Simuler un utilisateur connecté
    service.handleCallback('fake-jwt-token');
    const req = httpMock.expectOne('http://localhost:8080/api/auth/me');
    req.flush(mockUser);

    // Logout
    service.logout();

    expect(service.isAuthenticated$()).toBe(false);
    expect(service.user$()).toBeNull();
    expect(localStorage.getItem('skillstep_jwt')).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('doit retourner le token depuis localStorage', () => {
    localStorage.setItem('skillstep_jwt', 'mon-token');
    expect(service.getToken()).toBe('mon-token');
  });

  it('doit retourner null si pas de token', () => {
    expect(service.getToken()).toBeNull();
  });
});