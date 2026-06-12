import { ApplicationRef, createComponent, EnvironmentInjector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { ConfirmOptions } from '../models/confirm-options';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private readonly appRef:    ApplicationRef,
    private readonly injector:  EnvironmentInjector,
  ) {}

  // Retourne Observable<boolean> : true si confirmé, false si annulé
  open(options: ConfirmOptions = {}): Observable<boolean> {
    const result$ = new Subject<boolean>();

    // Crée dynamiquement le composant
    const componentRef = createComponent(ConfirmDialogComponent, {
      environmentInjector: this.injector,
    });

    // Passe les inputs
    componentRef.instance.title        = options.title        ?? 'Confirmation';
    componentRef.instance.message      = options.message      ?? 'Êtes-vous sûr ?';
    componentRef.instance.confirmLabel = options.confirmLabel ?? 'Supprimer';
    componentRef.instance.cancelLabel  = options.cancelLabel  ?? 'Annuler';
    componentRef.instance.danger       = options.danger       ?? true;

    // Écoute les outputs
    componentRef.instance.confirmed.subscribe(() => {
      result$.next(true);
      result$.complete();
      this.destroy(componentRef);
    });

    componentRef.instance.cancelled.subscribe(() => {
      result$.next(false);
      result$.complete();
      this.destroy(componentRef);
    });

    // Attache au DOM
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(
      (componentRef.hostView as any).rootNodes[0]
    );
    componentRef.changeDetectorRef.detectChanges();

    return result$.asObservable();
  }

  private destroy(ref: any): void {
    this.appRef.detachView(ref.hostView);
    ref.destroy();
  }
}
