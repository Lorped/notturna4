import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddcontattoPage } from './addcontatto.page';

describe('AddcontattoPage', () => {
  let component: AddcontattoPage;
  let fixture: ComponentFixture<AddcontattoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcontattoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
