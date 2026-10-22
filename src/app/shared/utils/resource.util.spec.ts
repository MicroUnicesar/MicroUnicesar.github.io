import { resourceIcon, toGraduationResource } from './resource.util';
import { Resource } from '../models/resource.model';

const base: Resource = {
  id: 'x', category: 'regulations', type: 'pdf', title: { es: 'Título', en: 'Title' }, url: 'https://example.test/x'
};

describe('resource.util', () => {
  it('picks an icon per resource type', () => {
    expect(resourceIcon('pdf')).toBe('bi-filetype-pdf');
    expect(resourceIcon('doc')).toBe('bi-file-earmark-word');
    expect(resourceIcon('form')).toBe('bi-send-arrow-down');
    expect(resourceIcon('link')).toBe('bi-box-arrow-up-right');
  });

  it('converts a resource into the graduation page view', () => {
    expect(toGraduationResource({ ...base, file: 'x.pdf' }))
      .toEqual({ icon: 'bi-filetype-pdf', link: 'https://example.test/x', name: base.title, file: 'x.pdf' });
  });

  it('uses an empty file name when the resource is not a download', () => {
    expect(toGraduationResource({ ...base, type: 'form' }).file).toBe('');
  });
});
