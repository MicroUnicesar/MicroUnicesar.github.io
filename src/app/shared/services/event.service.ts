import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Solicitud de Opciones de Grado',
      date: '2026-02-17',
      time: '05:00 PM',
      type: 'deadline',
      description: 'Fecha límite para envío de solicitudes del primer ciclo 2026-1.',
      location: 'Virtual',
      more_info: 'comiteinvestigacionmicro@unicesar.edu.co'
    },
    {
      id: 2,
      title: 'Seminario de Investigación',
      date: '2026-02-20',
      time: '02:00 PM',
      type: 'seminar',
      description: 'Presentación de avances en microbiología molecular.',
      location: 'Auditorio Principal',
      registration_link: 'https://www.unicesar.edu.co/eventos-4/',
    },
    {
      id: 3,
      title: 'Evaluación de Proyectos',
      date: '2026-02-28',
      time: '10:00 AM',
      type: 'evaluation',
      description: 'Sesión del comité de investigación para evaluación de propuestas.',
      location: 'Sala de Juntas',
      registration_link: 'https://forms.office.com/r/s3CWsmRAji',
      more_info: 'comitedeinvestigacionmicro@unicesar.edu.co'
    },
    {
      id: 4,
      title: 'Sustentaciones de Grado',
      date: '2026-04-16',
      time: '08:00 AM',
      type: 'defense',
      description: 'Presentaciones finales de trabajos de grado.',
      location: 'Sala de Juntas Facultad de Ciencias Básicas',
      more_info: 'comitedeinvestigacionfacbasicas@unicesar.edu.co'
    },
    {
      id: 5,
      title: 'Sustentaciones de Grado',
      date: '2026-04-16',
      time: '08:00 AM',
      type: 'defense',
      description: 'Presentaciones finales de trabajos de grado.',
      location: 'Sala de Juntas Facultad de Ciencias Básicas',
      more_info: 'comitedeinvestigacionfacbasicas@unicesar.edu.co'
    },
    {
      id: 6,
      title: 'Sustentaciones de Grado',
      date: '2026-04-16',
      time: '08:00 AM',
      type: 'defense',
      description: 'Presentaciones finales de trabajos de grado.',
      location: 'Sala de Juntas Facultad de Ciencias Básicas',
      more_info: 'comitedeinvestigacionfacbasicas@unicesar.edu.co'
    },
    {
      id: 7,
      title: 'Sustentaciones de Grado',
      date: '2026-04-16',
      time: '08:00 AM',
      type: 'defense',
      description: 'Presentaciones finales de trabajos de grado.',
      location: 'Sala de Juntas Facultad de Ciencias Básicas',
      more_info: 'comitedeinvestigacionfacbasicas@unicesar.edu.co'
    }
  ];

  getAllEvents(): Observable<Event[]> {
    const sorted = [...this.events].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return of(sorted);
  }

  getUpcomingEvents(count: number = 10): Observable<Event[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear hora para comparar solo fechas

    const upcoming = this.events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, count);

    return of(upcoming);
  }
}
