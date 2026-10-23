import { Injectable, signal } from '@angular/core';
import { LocalizedText } from '../../shared/models/localized-text.model';

/** Nombre del elemento abierto en una página de detalle (grupo, persona) para el último tramo de las migas. */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly _leaf = signal<LocalizedText | undefined>(undefined);
  readonly leaf = this._leaf.asReadonly();

  setLeaf(leaf: LocalizedText | undefined): void {
    this._leaf.set(leaf);
  }
}
