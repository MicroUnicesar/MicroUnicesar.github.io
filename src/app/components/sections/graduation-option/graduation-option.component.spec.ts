import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduationOptionComponent } from './graduation-option.component';

describe('GraduationOptionComponent', () => {
  let component: GraduationOptionComponent;
  let fixture: ComponentFixture<GraduationOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraduationOptionComponent]
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
