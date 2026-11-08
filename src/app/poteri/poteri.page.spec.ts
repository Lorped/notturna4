import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoteriPage } from './poteri.page';

describe('PoteriPage', () => {
  let component: PoteriPage;
  let fixture: ComponentFixture<PoteriPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoteriPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PoteriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
