import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ChangecontattoPage } from './changecontatto.page';
import { ToChange } from '../globals';

describe('ChangecontattoPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('should show the values of the selected contact on enter', () => {
    const tochange = TestBed.inject(ToChange);
    tochange.contatto = 'Mario';
    tochange.note = 'amico';
    tochange.cell = 1;
    tochange.home = 0;

    const component = TestBed.createComponent(ChangecontattoPage).componentInstance;
    component.ionViewWillEnter();

    expect(component.contatto()).toBe('Mario');
    expect(component.note()).toBe('amico');
    expect(component.cellChecked()).toBe(true);
    expect(component.homeChecked()).toBe(false);
  });

  it('should replace previous values when another contact is selected', () => {
    const tochange = TestBed.inject(ToChange);
    const component = TestBed.createComponent(ChangecontattoPage).componentInstance;

    tochange.contatto = 'Mario';
    tochange.cell = 1;
    component.ionViewWillEnter();

    tochange.contatto = 'Luigi';
    tochange.cell = 0;
    component.ionViewWillEnter();

    expect(component.contatto()).toBe('Luigi');
    expect(component.cellChecked()).toBe(false);
  });
});
