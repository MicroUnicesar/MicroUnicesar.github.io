import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { NewsService } from '../../../shared/services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [TranslatePipe, LocalizedPipe, LocalizedDatePipe],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent {
  allNews = toSignal(inject(NewsService).getAllNews(), { initialValue: [] });
}
