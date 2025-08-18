import { Injectable } from '@angular/core';

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content?: string;
  date: string;
  image: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  private newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Nuevo Laboratorio de Investigación',
      summary: 'Inauguración del moderno laboratorio de microbiología molecular.',
      content: 'Detailed content about the new laboratory...',
      date: '2024-01-15',
      image: 'assets/images/news/molecular_biology_lab.jpg',
      category: 'research'
    },
    {
      id: 2,
      title: 'Conferencia Internacional',
      summary: 'Participación en el congreso mundial de microbiología.',
      content: 'Details about the international conference...',
      date: '2024-01-10',
      image: 'assets/images/news/international_conference.jpg',
      category: 'events'
    },
    {
      id: 3,
      title: 'Graduación 2024',
      summary: 'Ceremonia de graduación de la promoción 2024.',
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
      category: 'research'
    },
    {
      id: 5,
      title: 'Nuevo Laboratorio de Investigación',
      summary: 'Inauguración del moderno laboratorio de microbiología molecular.',
      content: 'Detailed content about the new laboratory...',
      date: '2024-01-15',
      image: 'assets/images/news/molecular_biology_lab.jpg',
      category: 'research'
    },
    {
      id: 6,
      title: 'Conferencia Internacional',
      summary: 'Participación en el congreso mundial de microbiología.',
      content: 'Details about the international conference...',
      date: '2024-01-10',
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
      category: 'research'
    }
  ];

  getAllNews(): NewsItem[] {
    return this.newsItems;
  }

  getLatestNews(count: number = 3): NewsItem[] {
    return this.newsItems.slice(0, count);
  }

  getNewsById(id: number): NewsItem | undefined {
    return this.newsItems.find(item => item.id === id);
  }
}
