import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock:   HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(),
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: jest.fn(),
    });

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-25T10:00:00'));
  });
  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should send GET request with period parameter', () => {

    const blob = new Blob(['PDF']);

    service.generate({ period: 30 }).subscribe(response => {
      expect(response).toEqual(blob);
    });
    const req = httpMock.expectOne(
        `${environment.apiUrl}/reports/generate?period=30`
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');

      req.flush(blob);
  });
  it('should send GET request with date range', () => {

    const blob = new Blob(['PDF']);

    service.generate({
      from: '2026-01-01',
      to: '2026-01-31',
    }).subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.apiUrl}/reports/generate`
      && request.params.get('from') === '2026-01-01'
      && request.params.get('to') === '2026-01-31'
    );

    expect(req.request.method).toBe('GET');

    req.flush(blob);
  });
  it('should send GET request without parameters', () => {

    const blob = new Blob(['PDF']);

    service.generate({}).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/reports/generate`
    );

    expect(req.request.params.keys().length).toBe(0);

    req.flush(blob);
  });
  it('should create a download link and trigger download', () => {

    const blob = new Blob(['PDF']);
    const fakeUrl = 'blob:http://localhost/fake';

    const createObjectURLSpy = jest
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue(fakeUrl);

    const revokeSpy = jest
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const clickMock = jest.fn();

    const anchor = {
      href: '',
      download: '',
      click: clickMock,
    } as unknown as HTMLAnchorElement;

    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor);

    service.downloadBlob(blob, 'report.pdf');

    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);

    expect(createElementSpy).toHaveBeenCalledWith('a');

    expect(anchor.href).toBe(fakeUrl);

    expect(anchor.download).toBe('report.pdf');

    expect(clickMock).toHaveBeenCalled();

    expect(revokeSpy).toHaveBeenCalledWith(fakeUrl);
  });
  it('should add report to history', () => {

    const blob = new Blob(['PDF']);

    service.addToHistory(blob, '30 derniers jours');

    const reports = service.reports$();

    expect(reports.length).toBe(1);

    expect(reports[0].blob).toBe(blob);

    expect(reports[0].period).toBe('30 derniers jours');

    expect(reports[0].filename)
      .toBe('skillstep-rapport-2026-06-25.pdf');

    expect(reports[0].generatedAt).toBe('25 juin 2026');
  });
  it('should add newest report at the beginning of history', () => {

    const blob1 = new Blob(['PDF1']);
    const blob2 = new Blob(['PDF2']);

    service.addToHistory(blob1, 'Période 1');
    service.addToHistory(blob2, 'Période 2');

    const reports = service.reports$();

    expect(reports.length).toBe(2);

    expect(reports[0].blob).toBe(blob2);

    expect(reports[1].blob).toBe(blob1);
  });
 
});

