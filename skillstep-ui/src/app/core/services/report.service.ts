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
    // 1. Crée une URL temporaire (ex: blob:http://localhost:4200/...)
    const url  = URL.createObjectURL(blob);
    // 2. Crée un lien virtuel <a> dans la mémoire du navigateur
    const link = document.createElement('a');
    // 3. Associe l'URL du Blob et le nom du fichier voulu au lien
    link.href     = url;
    link.download = filename;
    // 4. Simule un clic de l'utilisateur pour lancer le téléchargement automatique
    link.click();
    // 5. Libère la mémoire du navigateur (très important pour éviter les fuites de mémoire !)
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
