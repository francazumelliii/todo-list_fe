import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// Integra provideHttpClient nell'appConfig
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), 
    provideHttpClient() // Aggiunge EnvironmentProviders correttamente
  ]
};

bootstrapApplication(AppComponent, updatedAppConfig);
