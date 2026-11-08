import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CacciaPage } from './caccia.page';

describe('CacciaPage', () => {
  let component: CacciaPage;
  let fixture: ComponentFixture<CacciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CacciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
