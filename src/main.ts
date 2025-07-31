import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LucideAngularModule, Book, Users, Tag, Plus, Trash2, Pencil } from 'lucide-angular';
import { MessageService } from 'primeng/api';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    ...(LucideAngularModule.pick({ Book, Users, Tag, Plus, Pencil, Trash2 }).providers ?? []),
    MessageService
  ]
}).catch((err) => console.error(err));