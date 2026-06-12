import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  @Input() title   = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ?';
  @Input() confirmLabel = 'Supprimer';
  @Input() cancelLabel  = 'Annuler';
  @Input() danger  = true;   // rouge si action destructive

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

}
