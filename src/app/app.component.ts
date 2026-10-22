import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SeoService } from './core/services/seo.service';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavigationComponent, FooterComponent, BreadcrumbComponent],
  template: `
    <app-header></app-header>
    <app-navigation></app-navigation>
    <main>
      <app-breadcrumb></app-breadcrumb>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'MicroUnicesar';
  // Se crea desde el inicio para que escuche las navegaciones y restablezca el título.
  private readonly seo = inject(SeoService);
}
