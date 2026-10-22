import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { EventService } from '../../../shared/services/event.service';
import { EventType } from '../../../shared/models/event.model';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

const ICONS: Record<EventType, string> = {
  deadline: 'bi bi-alarm',
  seminar: 'bi bi-person-video3',
  evaluation: 'bi bi-clipboard-check',
  defense: 'bi bi-mortarboard'
};

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [TranslatePipe, LocalizedPipe, LocalizedDatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsComponent {
  private readonly perPage = APP_CONSTANTS.PAGINATION.EVENTS_PER_PAGE;

  private allEvents = toSignal(inject(EventService).getUpcomingEvents(100), { initialValue: [] });
  private pages = signal(1);

  displayedEvents = computed(() => this.allEvents().slice(0, this.pages() * this.perPage));
  hasMoreEvents = computed(() => this.displayedEvents().length < this.allEvents().length);

  loadMore(): void {
    this.pages.update(pages => pages + 1);
  }

  getEventIcon(type: EventType): string {
    return ICONS[type] ?? 'bi bi-calendar-event';
  }
}
