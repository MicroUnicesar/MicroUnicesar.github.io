import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { PersonLinks } from '../../models/person.model';

interface ProfileLink {
  key: keyof PersonLinks;
  labelKey: string;
  icon: string;
  href: string;
}

const DEFINITIONS: { key: keyof PersonLinks; labelKey: string; icon: string; prefix?: string }[] = [
  { key: 'orcid', labelKey: 'link-orcid', icon: 'bi-person-vcard', prefix: 'https://orcid.org/' },
  { key: 'googleScholar', labelKey: 'link-scholar', icon: 'bi-mortarboard' },
  { key: 'cvlac', labelKey: 'link-cvlac', icon: 'bi-file-earmark-person' },
  { key: 'scopus', labelKey: 'link-scopus', icon: 'bi-journal-text' },
  { key: 'researchGate', labelKey: 'link-researchgate', icon: 'bi-people' },
  { key: 'website', labelKey: 'link-website', icon: 'bi-globe' }
];

/** Perfiles académicos de una persona. Solo muestra los que existen y son http(s). */
@Component({
  selector: 'app-person-links',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './person-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonLinksComponent {
  links = input<PersonLinks | undefined>();

  items = computed<ProfileLink[]>(() => {
    const links = this.links() ?? {};
    return DEFINITIONS.flatMap(definition => {
      const value = links[definition.key]?.trim();
      if (!value) {
        return [];
      }
      // El ORCID se puede guardar solo como identificador (0000-0000-0000-0000).
      const href = /^https?:\/\//i.test(value) ? value : definition.prefix ? definition.prefix + value : null;
      return href ? [{ key: definition.key, labelKey: definition.labelKey, icon: definition.icon, href }] : [];
    });
  });
}
