import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComponent,
        HttpClientTestingModule, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have default selectedPreset as 30', () => {
    expect(component.selectedPreset).toBe(30);
  });
  it('should have default customFrom and customTo as empty strings', () => {
    expect(component.customFrom).toBe('');
    expect(component.customTo).toBe('');
  });
  it('should return correct periodLabel for preset 7', () => {
    component.selectedPreset = 7;
    expect(component.periodLabel).toBe('7 derniers jours');
  });
  it('should return correct periodLabel for preset 30', () => {
    component.selectedPreset = 30;
    expect(component.periodLabel).toBe('30 derniers jours');
  });
  it('should return correct periodLabel for preset 90', () => {
    component.selectedPreset = 90;
    expect(component.periodLabel).toBe('90 derniers jours');
  });
  it('should return correct periodLabel for custom preset with valid dates', () => {
    component.selectedPreset = 'custom';
    component.customFrom = '2024-01-01';
    component.customTo = '2024-01-31';
    expect(component.periodLabel).toBe('01 janv. — 31 janv. 2024');
  });
  it('should return correct periodLabel for custom preset with missing dates', () => {
    component.selectedPreset = 'custom';
    component.customFrom = '';
    component.customTo = '';
    expect(component.periodLabel).toBe('Période personnalisée');
  });
  it("should return false for canGenerate when isGenerating$ is true", () => {
    (component as any).isGenerating$ = signal(true);
    expect(component.canGenerate).toBe(false);
  });
  it("should return false for canGenerate when custom preset and dates are invalid", () => {
    component.selectedPreset = 'custom';
    component.customFrom = '2024-01-31';
    component.customTo = '2024-01-01';
    expect(component.canGenerate).toBe(false);
  });
});
