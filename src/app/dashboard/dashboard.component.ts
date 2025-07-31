import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NgStyle } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { LucideAngularModule, Book, Users, Tag } from 'lucide-angular';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogAddEditComponent } from '../shared/dialogs/dialog-add-edit/dialog-add-edit.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthorService } from '../services/author.service';
import { Author } from '../models/author.model';
import { BookService } from '../services/book.service';
import { GenreService } from '../services/genre.service';
import { Genre } from '../models/genre.model';
import { BookRequest } from '../models/book.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CardModule,
    CommonModule,
    ButtonModule,
    NgStyle,
    LucideAngularModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  standalone: true,
  providers: [DialogService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private authorService: AuthorService,
    private bookService: BookService,
    private genreService: GenreService
  ) {
    this.loadData();
  }

  loadData() {
    this.loadBooks();
    this.loadAuthors();
    this.loadGenres();
  }

  stats = [
    {
      title: 'Total de Livros',
      value: '0',
      description: 'Livros cadastrados no sistema',
      icon: 'book',
      href: '/books',
      color: 'blue',
    },
    {
      title: 'Total de Autores',
      value: '0',
      description: 'Autores cadastrados no sistema',
      icon: 'users',
      href: '/authors',
      color: 'green',
    },
    {
      title: 'Total de Gêneros',
      value: '0',
      description: 'Gêneros cadastrados no sistema',
      icon: 'tag',
      href: '/genres',
      color: 'purple',
    },
  ];

  quickActions = [
    { label: 'Adicionar Novo Livro', tag: 'books', description: 'Livro' },
    { label: 'Adicionar Novo Autor', tag: 'authors', description: 'Autor' },
    { label: 'Adicionar Novo Gênero', tag: 'genres', description: 'Gênero' },
  ];

  recentActivities = [
    { label: 'Fundação', color: 'blue' },
    { label: 'Isaac Asimov', color: 'green' },
    { label: 'Ficção Científica', color: 'purple' },
  ];

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.updateStatValue('Total de Livros', data.length);
      },
      error: (err) => {
      },
    });
  }

  loadAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.updateStatValue('Total de Autores', data.length);
      },
      error: (err) => {
      },
    });
  }

  loadGenres() {
    this.genreService.getGenres().subscribe({
      next: (data) => {
        this.updateStatValue('Total de Gêneros', data.length);
      },
      error: (err) => {
      },
    });
  }

  updateStatValue(title: string, newValue: number) {
    const stat = this.stats.find((stat) => stat.title === title);
    if (stat) {
      stat.value = String(newValue);
    }
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
  ref: DynamicDialogRef | undefined;
  openDialog(action: any) {
    this.ref = this.dialogService.open(DialogAddEditComponent, {
      header: `Adicionar Novo ${action.description}`,
      width: '30%',
      data: {
        type: action.tag,
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        if (action.tag === 'books') this.addBook(result);
        if (action.tag === 'authors') this.addAuthor(result.name);
        if (action.tag === 'genres') this.addGenre(result.name);
      }
    });
  }

  addBook(newBookInfo: any) {
    const newBook: Omit<BookRequest, 'id'> = {
      title: newBookInfo.title,
      authorId: newBookInfo.authorId,
      genreId: newBookInfo.genreId,
    };
    this.bookService.createBook(newBook).subscribe({
      next: (response) => {
        this.showSuccess('Livro');
        this.loadBooks();
      },
      error: (error) => {
      },
    });
  }

  addAuthor(nameNewAuthor: string) {
    const newAuthor: Omit<Author, 'id'> = {
      name: nameNewAuthor,
    };

    this.authorService.createAuthor(newAuthor).subscribe({
      next: (response) => {
        this.showSuccess('Autor');
        this.loadAuthors();
      },
      error: (error) => {
      },
    });
  }

  addGenre(nameNewGenre: string) {
    const newGenre: Omit<Genre, 'id'> = {
      name: nameNewGenre,
    };

    this.genreService.createGenre(newGenre).subscribe({
      next: (response) => {
        this.showSuccess('Genero');
        this.loadGenres();
      },
      error: (error) => {
      },
    });
  }
  showSuccess(tag: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${tag} salvo com sucesso`,
    });
  }
}
