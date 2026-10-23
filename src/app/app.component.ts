import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SeoService } from './core/services/seo.service';
import { TranslatePipe } from './shared/pipes/translate-pipe';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslatePipe, RouterOutlet, HeaderComponent, NavigationComponent, FooterComponent, BreadcrumbComponent],
  template: `
    <a class="skip-link visually-hidden-focusable" href="#main-content" (click)="skipToContent($event, main)">{{ 'skip-to-content' | translate }}</a>
    <app-header></app-header>
    <app-navigation></app-navigation>
    <main #main id="main-content" tabindex="-1">
      <app-breadcrumb></app-breadcrumb>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'MicroUnicesar';

  /** Con <base href="/"> un enlace #ancla llevaría a la portada; por eso se enfoca el contenido a mano. */
  skipToContent(event: Event, main: HTMLElement): void {
    event.preventDefault();
    main.focus();
  }

  // Se crea desde el inicio para que escuche las navegaciones y restablezca el título.
  private readonly seo = inject(SeoService);
}
