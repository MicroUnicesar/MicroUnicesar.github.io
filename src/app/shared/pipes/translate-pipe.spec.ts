import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate-pipe';

describe('TranslatePipe', () => {
  it('create an instance', () => {
    const pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
    expect(pipe).toBeTruthy();
  });
});
