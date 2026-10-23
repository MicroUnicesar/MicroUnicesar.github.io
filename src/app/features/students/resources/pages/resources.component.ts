import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';
import { ResourcesService } from '../../../../shared/services/resources.service';
import { RESOURCE_CATEGORIES, Resource, ResourceCategory } from '../../../../shared/models/resource.model';
import { resourceIcon } from '../../../../shared/utils/resource.util';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [TranslatePipe, LocalizedPipe, ComingSoonComponent],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesComponent {
  private resources = toSignal(inject(ResourcesService).getResources());

  loaded = computed(() => this.resources() !== undefined);

  /** Solo las categorías que tienen recursos, en el orden definido. */
  categories = computed(() =>
    RESOURCE_CATEGORIES
      .map(category => ({ category, items: (this.resources() ?? []).filter(resource => resource.category === category) }))
      .filter(group => group.items.length > 0));

  labelKey(category: ResourceCategory): string {
    return `resources-cat-${category}`;
  }

  icon(resource: Resource): string {
    return resourceIcon(resource.type);
  }
}
