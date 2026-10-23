import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse, NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { NavDropdownEntry, buildNavEntries, isDropdownActive } from '../../utils/nav-entries.util';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, TranslatePipe,
    NgbCollapse, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  private router = inject(Router);

  readonly entries = buildNavEntries();
  /** Menú móvil plegado. */
  readonly collapsed = signal(true);
  private currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(event => {
        this.currentUrl.set((event as NavigationEnd).urlAfterRedirects);
        this.collapsed.set(true);
      });
  }

  toggle(): void {
    this.collapsed.update(value => !value);
  }

  isActive(entry: NavDropdownEntry): boolean {
    return isDropdownActive(entry, this.currentUrl());
  }
}
