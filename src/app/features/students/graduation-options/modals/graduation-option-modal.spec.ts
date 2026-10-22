import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduationOptionModal } from './graduation-option-modal';

describe('GraduationOptionModal', () => {
  let component: GraduationOptionModal;
  let fixture: ComponentFixture<GraduationOptionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraduationOptionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraduationOptionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
