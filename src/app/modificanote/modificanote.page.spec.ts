import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificanotePage } from './modificanote.page';

describe('ModificanotePage', () => {
  let component: ModificanotePage;
  let fixture: ComponentFixture<ModificanotePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificanotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
