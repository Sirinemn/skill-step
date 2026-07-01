import { Injectable, signal } from '@angular/core';
import { GeneratedReport } from '../utils/generate-report.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly url = `${environment.apiUrl}/reports/generate`;

  // Historique des rapports générés dans la session
  readonly reports$ = signal<GeneratedReport[]>([]);

  constructor(private readonly http: HttpClient) { }

  generate(params: {
    period?: number;
    from?: string;
    to?: string;
  }): Observable<Blob> {
    // responseType: 'blob' — reçoit le PDF comme binaire
    let httpParams: Record<string, string> = {};
    if (params.period) httpParams['period'] = params.period.toString();
    if (params.from)   httpParams['from']   = params.from;
    if (params.to)     httpParams['to']     = params.to;

    return this.http.get(this.url, {
      params:       httpParams,
      responseType: 'blob',
    });
  }

  // Télécharge le blob comme fichier
  downloadBlob(blob: Blob, filename: string): void {
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Ajoute le rapport à l'historique de session
  addToHistory(blob: Blob, period: string): void {
    const now  = new Date();
    const date = now.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const filename = `skillstep-rapport-${now.toISOString().split('T')[0]}.pdf`;

    this.reports$.update(list => [{
      filename,
      period,
      generatedAt: date,
      blob,
    }, ...list]);
  }
}
