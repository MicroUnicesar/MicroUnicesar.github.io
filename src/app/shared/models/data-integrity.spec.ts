import groupsJson from '../../../assets/data/research-groups.json';
import linesJson from '../../../assets/data/research-lines.json';
import labsJson from '../../../assets/data/labs.json';
import graduationJson from '../../../assets/data/graduation-options.json';
import { ResearchGroup } from './research-group.model';
import { ResearchLine } from './research-line.model';
import { Lab } from './lab.model';
import { GraduationData } from './graduation-data.model';

// Valida los JSON reales de producción contra los modelos y sus referencias cruzadas.
const groups: ResearchGroup[] = groupsJson;
const lines: ResearchLine[] = linesJson;
const labs: Lab[] = labsJson;
const graduation: GraduationData = graduationJson as GraduationData;

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
    expect(graduation.resources.length).toBe(6);
    expect(graduation.cicles.length).toBe(6);
    expect(graduation.faqs.length).toBe(4);
  });
});
