import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MortePage } from './morte.page';

describe('MortePage', () => {
  let component: MortePage;
  let fixture: ComponentFixture<MortePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MortePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
