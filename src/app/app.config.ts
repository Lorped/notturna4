import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { provideIonicAngular } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    importProvidersFrom(AppRoutingModule),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
  ],
};