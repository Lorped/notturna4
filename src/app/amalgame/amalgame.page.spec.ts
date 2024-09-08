import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmalgamePage } from './amalgame.page';

describe('AmalgamePage', () => {
  let component: AmalgamePage;
  let fixture: ComponentFixture<AmalgamePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AmalgamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
