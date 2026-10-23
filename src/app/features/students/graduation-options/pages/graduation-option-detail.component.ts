import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { NotFoundComponent } from '../../../../shared/components/not-found/not-found.component';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { SeoService } from '../../../../core/services/seo.service';
import { GraduationOptionsService } from '../../../../shared/services/graduation-options.service';
import { ResourcesService } from '../../../../shared/services/resources.service';
import { GraduationDocument, GraduationOption } from '../../../../shared/models/graduation-option.model';
import { Resource } from '../../../../shared/models/resource.model';
import { GRADUATION_CONTACT_EMAIL } from '../graduation-options.constants';

export interface GraduationDetail {
  option: GraduationOption;
  others: GraduationOption[];
  resources: Map<string, Resource>;
}

/** Página de una opción de grado: descripción, requisitos, documentos y ruta. Las secciones vacías no se muestran. */
@Component({
  selector: 'app-graduation-option-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, NotFoundComponent],
  templateUrl: './graduation-option-detail.component.html',
  styleUrl: './graduation-option-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraduationOptionDetailComponent {
  private graduationService = inject(GraduationOptionsService);
  private resourcesService = inject(ResourcesService);
  private seo = inject(SeoService);

  readonly contactEmail = GRADUATION_CONTACT_EMAIL;

  /** Viene del parámetro de ruta `:id`. */
  id = input.required<string>();

  /** `undefined` mientras carga, `null` si la opción no existe. */
  detail = toSignal(toObservable(this.id).pipe(switchMap(id => this.load(id))));
  notFound = computed(() => this.detail() === null);

  constructor() {
    const breadcrumbs = inject(BreadcrumbService);
    effect(() => {
      const detail = this.detail();
      breadcrumbs.setLeaf(detail?.option.title);
      if (detail) {
        this.seo.set({ title: detail.option.title, description: detail.option.description });
      } else if (detail === null) {
        this.seo.set({ title: { key: 'not-found-grade-title' } });
      }
    });
    inject(DestroyRef).onDestroy(() => breadcrumbs.setLeaf(undefined));
  }

  /** Recurso real (formato o formulario) al que enlaza un documento, si lo tiene. */
  resourceOf(document: GraduationDocument, detail: GraduationDetail): Resource | undefined {
    return document.resourceId ? detail.resources.get(document.resourceId) : undefined;
  }

  private load(id: string) {
    return forkJoin({
      options: this.graduationService.getGraduationOptions(),
      resources: this.resourcesService.getResources()
    }).pipe(
      map(({ options, resources }): GraduationDetail | null => {
        const option = options.find(candidate => candidate.id === id);
        return option
          ? {
              option,
              others: options.filter(candidate => candidate.id !== id),
              resources: new Map(resources.map(resource => [resource.id, resource]))
            }
          : null;
      })
    );
  }
}
