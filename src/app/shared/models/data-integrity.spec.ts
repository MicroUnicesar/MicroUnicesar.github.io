import groupsJson from '../../../assets/data/research-groups.json';
import linesJson from '../../../assets/data/research-lines.json';
import labsJson from '../../../assets/data/labs.json';
import graduationJson from '../../../assets/data/graduation-options.json';
import peopleJson from '../../../assets/data/people.json';
import resourcesJson from '../../../assets/data/resources.json';
import peopleTemplateJson from '../../../assets/data/people.template.json';
import { ResearchGroup } from './research-group.model';
import { ResearchLine } from './research-line.model';
import { Lab } from './lab.model';
import { GraduationData } from './graduation-data.model';
import { Person } from './person.model';
import { RESOURCE_CATEGORIES, Resource } from './resource.model';

// Valida los JSON reales de producción contra los modelos y sus referencias cruzadas.
const groups: ResearchGroup[] = groupsJson;
const lines: ResearchLine[] = linesJson;
const labs: Lab[] = labsJson;
const graduation: GraduationData = graduationJson as GraduationData;
const people: Person[] = peopleJson as Person[];
const resources: Resource[] = resourcesJson as Resource[];

describe('content data integrity', () => {
  it('has unique ids in every collection', () => {
    for (const items of [groups, lines, labs]) {
      const ids = items.map(item => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('research lines only reference existing groups', () => {
    const groupIds = new Set(groups.map(group => group.id));
    for (const line of lines) {
      for (const id of line.groupIds) {
        expect(groupIds.has(id)).withContext(`${line.id} -> ${id}`).toBeTrue();
      }
    }
  });

  it('labs only reference existing research lines', () => {
    const lineIds = new Set(lines.map(line => line.id));
    for (const lab of labs) {
      for (const id of lab.researchLineIds) {
        expect(lineIds.has(id)).withContext(`${lab.id} -> ${id}`).toBeTrue();
      }
    }
  });

  it('every lab declares whether it is a semillero', () => {
    for (const lab of labs) {
      expect(typeof lab.isSemillero).withContext(lab.id).toBe('boolean');
    }
  });

  it('groups do not carry template placeholders', () => {
    for (const group of groups) {
      expect('requirements' in group).withContext(group.id).toBeFalse();
      expect(group.projectIds).withContext(group.id).toEqual([]);
    }
  });

  it('every localized field has a Spanish text', () => {
    const everyEs = (value: unknown): void => {
      if (Array.isArray(value)) {
        value.forEach(everyEs);
      } else if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        if ('es' in record && 'en' in record) {
          expect(typeof record['es'] === 'string' && record['es'] !== '').toBeTrue();
        } else {
          Object.values(record).forEach(everyEs);
        }
      }
    };
    [groups, lines, labs, graduation].forEach(everyEs);
  });

  it('keeps all graduation sections', () => {
    expect(graduation.options.length).toBe(8);
    expect(graduation.resourceIds.length).toBe(6);
    expect(graduation.cicles.length).toBe(6);
    expect(graduation.faqs.length).toBe(4);
  });

  describe('resources', () => {
    it('has unique ids, a known category and a real https URL', () => {
      const ids = resources.map(resource => resource.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const resource of resources) {
        expect(RESOURCE_CATEGORIES as readonly string[]).withContext(resource.id).toContain(resource.category);
        expect(['pdf', 'doc', 'form', 'link']).withContext(resource.id).toContain(resource.type);
        expect(resource.url).withContext(resource.id).toMatch(/^https:\/\//);
        expect(resource.title.es.trim()).withContext(resource.id).not.toBe('');
      }
    });

    it('graduation options only list resources that exist', () => {
      const ids = new Set(resources.map(resource => resource.id));
      for (const id of graduation.resourceIds) {
        expect(ids.has(id)).withContext(id).toBeTrue();
      }
    });

    it('keeps the graduation links that existed before the move to resources.json', () => {
      const urlOf = (id: string) => resources.find(resource => resource.id === id)?.url;
      expect(graduation.resourceIds).toEqual([
        'acuerdo-005-2025', 'ruta-seleccion-opcion-grado', 'formato-solicitud-opcion-grado',
        'formato-anteproyecto', 'formato-trabajo-grado-final', 'formulario-seleccion-opcion-grado'
      ]);
      expect(urlOf('formulario-seleccion-opcion-grado')).toBe('https://forms.office.com/r/s3CWsmRAji');
      expect(urlOf('acuerdo-005-2025')).toContain('acuerdo-no-005-del-12-de-febrero-de-2025');
    });
  });

  describe('people', () => {
    it('has unique ids and valid categories', () => {
      const ids = people.map(person => person.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const person of people) {
        expect(['faculty', 'student', 'staff', 'alumni']).withContext(person.id).toContain(person.category);
        expect(person.fullName.trim()).withContext(person.id).not.toBe('');
      }
    });

    it('only references existing groups', () => {
      const groupIds = new Set(groups.map(group => group.id));
      for (const person of people) {
        for (const id of person.groupIds) {
          expect(groupIds.has(id)).withContext(`${person.id} -> ${id}`).toBeTrue();
        }
      }
    });

    it('groups only list people that exist', () => {
      const personIds = new Set(people.map(person => person.id));
      for (const group of groups) {
        for (const id of [...group.memberIds, ...(group.leaderId ? [group.leaderId] : [])]) {
          expect(personIds.has(id)).withContext(`${group.id} -> ${id}`).toBeTrue();
        }
      }
    });

    it('every lab responsible links to an existing person', () => {
      const byId = new Map(people.map(person => [person.id, person]));
      for (const lab of labs) {
        expect(lab.piId).withContext(lab.id).toBeTruthy();
        const person = byId.get(lab.piId!);
        expect(person).withContext(`${lab.id} -> ${lab.piId}`).toBeDefined();
        expect(person?.fullName).withContext(lab.id).toBe(lab.pi);
      }
    });

    it('external links are http(s) URLs or an ORCID id', () => {
      for (const person of people) {
        for (const [key, value] of Object.entries(person.links)) {
          const ok = /^https?:\/\//.test(value) || (key === 'orcid' && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(value));
          expect(ok).withContext(`${person.id}.${key}`).toBeTrue();
        }
      }
    });

    it('the template is clearly marked and shares no id with production data', () => {
      const [template] = peopleTemplateJson as unknown as (Person & Record<string, unknown>)[];
      expect(peopleTemplateJson.length).toBe(1);
      expect(template.id).toContain('PLANTILLA');
      expect(template.fullName).toContain('PLANTILLA');
      expect(people.some(person => person.id === template.id)).toBeFalse();
      expect(JSON.stringify(people)).not.toContain('PLANTILLA');
    });
  });
});
