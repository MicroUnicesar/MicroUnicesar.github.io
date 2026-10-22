import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { GraduationOptionComponent } from './graduation-option.component';

describe('GraduationOptionComponent', () => {
  let component: GraduationOptionComponent;
  let fixture: ComponentFixture<GraduationOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraduationOptionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraduationOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
