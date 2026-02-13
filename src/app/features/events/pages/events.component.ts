import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../shared/services/event.service';
import { Event } from '../../../shared/models/event.model';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-events',
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  allEvents: Event[] = [];
  displayedEvents: Event[] = [];
  eventsPerPage = APP_CONSTANTS.PAGINATION.EVENTS_PER_PAGE;
  currentPage = 1;
  hasMoreEvents = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getUpcomingEvents(100).subscribe(events => {
      this.allEvents = events;
      this.loadMore();
    });
  }

  loadMore(): void {
    const startIndex = (this.currentPage - 1) * this.eventsPerPage;
    const endIndex = startIndex + this.eventsPerPage;
    const newEvents = this.allEvents.slice(startIndex, endIndex);

    this.displayedEvents = [...this.displayedEvents, ...newEvents];
    this.currentPage++;
    this.hasMoreEvents = this.displayedEvents.length < this.allEvents.length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      deadline: 'bi bi-alarm',
      seminar: 'bi bi-person-video3',
      evaluation: 'bi bi-clipboard-check',
      defense: 'bi bi-mortarboard'
    };
    return icons[type] || 'bi bi-calendar-event';
  }

  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      deadline: 'Fecha límite',
      seminar: 'Seminario',
      evaluation: 'Evaluación',
      defense: 'Sustentación'
    };
    return labels[type] || type;
  }
}
