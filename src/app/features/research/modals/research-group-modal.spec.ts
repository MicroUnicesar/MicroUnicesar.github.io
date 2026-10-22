import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ResearchGroupModal } from './research-group-modal';

describe('ResearchGroupModal', () => {
  let component: ResearchGroupModal;
  let fixture: ComponentFixture<ResearchGroupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchGroupModal],
      providers: [provideHttpClient(), provideHttpClientTesting()]
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
