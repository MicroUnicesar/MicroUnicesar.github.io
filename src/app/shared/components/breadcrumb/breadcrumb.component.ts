import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { LocalizedPipe } from '../../pipes/localized.pipe';
import { buildBreadcrumb } from '../../utils/breadcrumb.util';

/** Migas de pan. Se colocan una vez en el layout y siguen la URL actual. */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  private router = inject(Router);
  private breadcrumbs = inject(BreadcrumbService);

  private url = signal(this.router.url);

  items = computed(() => buildBreadcrumb(this.url(), this.breadcrumbs.leaf()));

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(event => this.url.set((event as NavigationEnd).urlAfterRedirects));
  }
}
