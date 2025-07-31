import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { BookService } from '../services/book.service';
import { AuthorService } from '../services/author.service';
import { GenreService } from '../services/genre.service';
import { of, Subject } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let routerSpy: jasmine.SpyObj<Router>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let genreServiceSpy: jasmine.SpyObj<GenreService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    bookServiceSpy = jasmine.createSpyObj('BookService', ['getBooks', 'createBook']);
    authorServiceSpy = jasmine.createSpyObj('AuthorService', ['getAuthors', 'createAuthor']);
    genreServiceSpy = jasmine.createSpyObj('GenreService', ['getGenres', 'createGenre']);

    bookServiceSpy.getBooks.and.returnValue(of([]));
    authorServiceSpy.getAuthors.and.returnValue(of([]));
    genreServiceSpy.getGenres.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: BookService, useValue: bookServiceSpy },
        { provide: AuthorService, useValue: authorServiceSpy },
        { provide: GenreService, useValue: genreServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar livros e atualizar estatística', () => {
    bookServiceSpy.getBooks.and.returnValue(of([{ id: '1', title: 'Livro 1', authorId: 'a1', genreId: 'g1', authorName: 'Autor 1', genreName: 'Gênero 1' }]));
    component.loadBooks();
    expect(component.stats.find(s => s.title === 'Total de Livros')?.value).toBe('1');
  });

  it('deve carregar autores e atualizar estatística', () => {
    authorServiceSpy.getAuthors.and.returnValue(of([{ id: '1', name: 'Autor 1' }]));
    component.loadAuthors();
    expect(component.stats.find(s => s.title === 'Total de Autores')?.value).toBe('1');
  });

  it('deve carregar gêneros e atualizar estatística', () => {
    genreServiceSpy.getGenres.and.returnValue(of([{ id: '1', name: 'Gênero 1' }]));
    component.loadGenres();
    expect(component.stats.find(s => s.title === 'Total de Gêneros')?.value).toBe('1');
  });

  it('deve navegar para a rota especificada', () => {
    component.navigateTo('/books');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/books');
  });

  it('deve exibir toast de sucesso', () => {
    component.showSuccess('Livro');
    expect(messageServiceSpy.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success',
      detail: 'Livro salvo com sucesso'
    }));
  });

  it('deve adicionar um novo livro', () => {
    bookServiceSpy.createBook.and.returnValue(of({ success: true, data: 'ok' }));
    bookServiceSpy.getBooks.and.returnValue(of([]));

    const newBookInfo = {
      title: 'Novo Livro',
      authorId: '123',
      genreId: '456',
    };

    component.addBook(newBookInfo);
    expect(bookServiceSpy.createBook).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('deve adicionar novo autor', () => {
    authorServiceSpy.createAuthor.and.returnValue(of({ success: true, data: 'ok' }));
    authorServiceSpy.getAuthors.and.returnValue(of([]));

    component.addAuthor('Novo Autor');
    expect(authorServiceSpy.createAuthor).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('deve adicionar novo gênero', () => {
    genreServiceSpy.createGenre.and.returnValue(of({ success: true, data: 'ok' }));
    genreServiceSpy.getGenres.and.returnValue(of([]));

    component.addGenre('Novo Gênero');
    expect(genreServiceSpy.createGenre).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });
});
