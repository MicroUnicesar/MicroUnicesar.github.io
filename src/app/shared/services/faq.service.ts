import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { Faq } from '../models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private dataLoader = inject(DataLoaderService);

  getFaqs(): Observable<Faq[]> {
    return this.dataLoader.load<Faq[]>('faqs');
  }
}
