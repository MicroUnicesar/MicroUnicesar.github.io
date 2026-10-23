import es from '../assets/i18n/es.json';
import en from '../assets/i18n/en.json';
import faqs from '../assets/data/faqs.json';
import graduation from '../assets/data/graduation-options.json';
import labs from '../assets/data/labs.json';
import program from '../assets/data/program.json';
import groups from '../assets/data/research-groups.json';
import lines from '../assets/data/research-lines.json';
import resources from '../assets/data/resources.json';
import news from '../assets/data/news.json';
import events from '../assets/data/events.json';
import wellness from '../assets/data/wellness.json';

const dictionaries: Record<string, Record<string, string>> = { es, en };
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort().join(',');

describe('i18n dictionaries', () => {
  const esKeys = Object.keys(es).sort();
  const enKeys = Object.keys(en).sort();

  it('es.json and en.json have exactly the same keys', () => {
    const missingInEn = esKeys.filter(key => !(key in en));
    const missingInEs = enKeys.filter(key => !(key in es));
    expect(missingInEn).withContext(`faltan en en.json: ${missingInEn.join(', ')}`).toEqual([]);
    expect(missingInEs).withContext(`faltan en es.json: ${missingInEs.join(', ')}`).toEqual([]);
    expect(enKeys).toEqual(esKeys);
  });

  it('has no empty values', () => {
    for (const [lang, dictionary] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dictionary)) {
        expect(typeof value === 'string' && value.trim().length > 0).withContext(`${lang}:${key}`).toBeTrue();
      }
    }
  });

  it('uses the same {parameters} in both languages', () => {
    for (const key of esKeys) {
      expect(placeholders(en[key as keyof typeof en])).withContext(key).toBe(placeholders(es[key as keyof typeof es]));
    }
  });

  it('does not leave translation markers in the English dictionary', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(value).withContext(key).not.toContain('TODO');
    }
  });

  it('English text differs from Spanish except for proper names', () => {
    const properNames = ['footer-university'];
    const identical = esKeys.filter(key => !properNames.includes(key) && es[key as keyof typeof es] === en[key as keyof typeof en] && es[key as keyof typeof es].length > 14);
    expect(identical).withContext(`textos largos sin traducir: ${identical.join(', ')}`).toEqual([]);
  });
});

describe('bilingual data', () => {
  const files: Record<string, unknown> = { faqs, graduation, labs, program, groups, lines, resources, news, events, wellness };

  const collect = (node: unknown, where: string, out: { where: string; es: string; en: string }[]): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => collect(item, `${where}[${index}]`, out));
    } else if (node && typeof node === 'object') {
      const record = node as Record<string, unknown>;
      const keys = Object.keys(record);
      if (keys.length === 2 && 'es' in record && 'en' in record) {
        out.push({ where, es: String(record['es']), en: String(record['en']) });
      } else {
        Object.entries(record).forEach(([key, value]) => collect(value, `${where}.${key}`, out));
      }
    }
  };

  for (const [name, data] of Object.entries(files)) {
    it(`${name}: every text has Spanish and English, with no pending translation`, () => {
      const texts: { where: string; es: string; en: string }[] = [];
      collect(data, name, texts);
      expect(texts.length).withContext(name).toBeGreaterThan(0);
      for (const text of texts) {
        expect(text.es.trim()).withContext(`${text.where} (es)`).not.toBe('');
        expect(text.en.trim()).withContext(`${text.where} (en)`).not.toBe('');
        expect(text.en).withContext(`${text.where} pendiente`).not.toBe('TODO_TRADUCCION');
      }
    });
  }

  it('the English of long texts is not a copy of the Spanish', () => {
    const copies: string[] = [];
    for (const [name, data] of Object.entries(files)) {
      const texts: { where: string; es: string; en: string }[] = [];
      collect(data, name, texts);
      copies.push(...texts.filter(text => text.es.length > 40 && text.es === text.en && text.es !== 'TODO_CONTENIDO').map(text => text.where));
    }
    expect(copies).toEqual([]);
  });
});
