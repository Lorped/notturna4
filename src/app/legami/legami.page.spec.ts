import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegamiPage } from './legami.page';

describe('LegamiPage', () => {
  let component: LegamiPage;
  let fixture: ComponentFixture<LegamiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LegamiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
