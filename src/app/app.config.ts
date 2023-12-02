import { ApplicationConfig } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';

export const routes: Routes = [];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
