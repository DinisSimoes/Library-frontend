import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BooksComponent } from './books/books.component';
import { AuthorsComponent } from './authors/authors.component';
import { GenresComponent } from './genres/genres.component';

export const routes: Routes = [
    {
    path: '',
    component: DashboardComponent,  // rota padrão ("/")
    pathMatch: 'full'
  },
  {
    path: 'books',
    component: BooksComponent
  },
  {
    path: 'authors',
    component: AuthorsComponent
  },
  {
    path: 'genres',
    component: GenresComponent
  },
  {
    path: '**',  // rota coringa para redirecionar para o dashboard se caminho inválido
    redirectTo: '',
  }
];
