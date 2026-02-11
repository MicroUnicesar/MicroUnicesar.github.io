import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { News } from '../shared/models/news.model';

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  private readonly PAGE_SIZE = 10;

  private news: News[] = [
    {
      id: 1,
      title: 'Inicio de clases 2026-1',
      summary: 'El programa de Microbiología inicia el ciclo académico 2025-5.',
      content: 'Detailed content about ...',
      date: '2024-01-15',
      image: 'assets/images/news/students.jpg',
      category: 'research'
    },
    {
      id: 2,
      title: 'Conferencia Internacional',
      summary: 'Participación en el congreso internacional de microbiología.',
      content: 'Details about the international conference...',
      date: '2024-01-10',
      image: 'assets/images/news/international_conference.jpg',
      category: 'events'
    },
    {
      id: 3,
      title: 'Graduación 2025',
      summary: 'Ceremonia de graduación de la promoción 2025.',
      content: 'Graduation ceremony details...',
      date: '2024-01-05',
      image: 'assets/images/news/graduation.jpg',
      category: 'academic'
    },
    {
      id: 4,
      title: 'Nueva Investigación Publicada',
      summary: 'Estudio sobre microorganismos resistentes publicado en revista internacional.',
      date: '2024-01-20',
      image: 'assets/images/news/research.jpg',
      category: 'research',
      isHighlight: true
    },
    {
      id: 5,
      title: 'Nuevo Laboratorio de Investigación',
      summary: 'Inauguración del moderno laboratorio de microbiología molecular.',
      content: 'Detailed content about the new laboratory...',
      date: '2024-01-15',
      image: 'assets/images/news/new_lab.jpg',
      category: 'research',
      isHighlight: true
    },
    {
      id: 6,
      title: 'Jornada de presentación de trabajos de grado',
      summary: 'Estudiantes presentan sus investigaciones finales.',
      content: 'Details about the international conference...',
      date: '2025-01-10',
      image: 'assets/images/news/international_conference.jpg',
      category: 'events'
    },
    {
      id: 7,
      title: 'Graduación 2024',
      summary: 'Ceremonia de graduación de la promoción 2024.',
      content: 'Graduation ceremony details...',
      date: '2024-01-05',
      image: 'assets/images/news/graduation.jpg',
      category: 'academic'
    },
    {
      id: 8,
      title: 'Nueva Investigación Publicada',
      summary: 'Estudio sobre microorganismos resistentes publicado en revista internacional.',
      date: '2024-01-20',
      image: 'assets/images/news/research.jpg',
      category: 'research',
      isHighlight: true
    }
  ];

  getAllNews(): Observable<News[]> {
    const sorted = [...this.news].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return of(sorted);
  }

  getLatestNews(count: number = 3): Observable<News[]> {
    const sorted = [...this.news].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return of(sorted.slice(0, count));
  }

  getHighlights(count: number = 3): Observable<News[]> {
    const highlights = this.news
      .filter(news => news.isHighlight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);

    return of(highlights);
  }

  getNewsById(id: number): Observable<News | undefined> {
    return of(this.news.find(item => item.id === id));
  }

  getNewsPaginated(page: number = 0): Observable<{ news: News[], total: number }> {
    const sorted = [...this.news].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const start = page * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;

    return of({
      news: sorted.slice(start, end),
      total: sorted.length
    });
  }
}
