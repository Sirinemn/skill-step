import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {

    // Reset localStorage
    localStorage.clear();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.current$()).toBe('light');
    expect(service.isDark$()).toBe(false);
  });

  it('should initialize with saved theme from localStorage', () => {

    localStorage.setItem('skillstep_theme', 'dark');

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({});

    const newService = TestBed.inject(ThemeService);

    expect(newService.current$()).toBe('dark');
    expect(newService.isDark$()).toBe(true);
  });

  it('should toggle from light to dark', () => {
    service.toggle();

    expect(service.current$()).toBe('dark');
    expect(service.isDark$()).toBe(true);
  });

  it('should toggle from dark to light', () => {
    service.setTheme('dark');

    service.toggle();

    expect(service.current$()).toBe('light');
    expect(service.isDark$()).toBe(false);
  });

  it('should set theme explicitly', () => {
    service.setTheme('dark');

    expect(service.current$()).toBe('dark');
    expect(service.isDark$()).toBe(true);
  });

  it('should add dark class to html element', () => {
    service.setTheme('dark');

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class from html element', () => {
    service.setTheme('dark');

    service.setTheme('light');

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should save theme to localStorage', () => {
    service.setTheme('dark');
    
    expect(localStorage.getItem('skillstep_theme')).toBe('dark');
  });

  it('should use system dark theme if no saved theme exists', () => {

    // Mock dark system preference
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({});

    const newService = TestBed.inject(ThemeService);

    expect(newService.current$()).toBe('dark');
  });
});
