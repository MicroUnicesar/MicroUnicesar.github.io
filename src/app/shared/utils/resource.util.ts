import { Resource, ResourceType } from '../models/resource.model';
import { GraduationResource } from '../models/graduation-resource.model';

const ICONS: Record<ResourceType, string> = {
  pdf: 'bi-filetype-pdf',
  doc: 'bi-file-earmark-word',
  form: 'bi-send-arrow-down',
  link: 'bi-box-arrow-up-right'
};

export function resourceIcon(type: ResourceType): string {
  return ICONS[type];
}

/** Vista de un recurso en la página de opciones de grado. */
export function toGraduationResource(resource: Resource): GraduationResource {
  return { icon: resourceIcon(resource.type), link: resource.url, name: resource.title, file: resource.file ?? '' };
}
