import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchGroupModal } from './research-group-modal';

describe('ResearchGroupModal', () => {
  let component: ResearchGroupModal;
  let fixture: ComponentFixture<ResearchGroupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchGroupModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchGroupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
