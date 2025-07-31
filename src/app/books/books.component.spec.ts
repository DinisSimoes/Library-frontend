import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksComponent } from './books.component';
import { BookService } from '../services/book.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Book } from '../models/book.model';
import { of, throwError } from 'rxjs';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Book 1',
      authorId: 'a1',
      authorName: 'Author 1',
      genreId: 'g1',
      genreName: 'Genre 1'
    },
    {
      id: '2',
      title: 'Book 2',
      authorId: 'a2',
      authorName: 'Author 2',
      genreId: 'g2',
      genreName: 'Genre 2'
    }
  ];

  beforeEach(async () => {
    const bookSpy = jasmine.createSpyObj('BookService', ['getBooks', 'updateBook', 'deleteBook']);
    const msgSpy = jasmine.createSpyObj('MessageService', ['add']);

    bookSpy.getBooks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [BooksComponent],
      providers: [
        DialogService,
        { provide: BookService, useValue: bookSpy },
        { provide: MessageService, useValue: msgSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os livros ao iniciar', () => {
    bookServiceSpy.getBooks.and.returnValue(of(mockBooks));
    component.loadBooks();
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
    expect(component.books.length).toBe(2);
  });

  it('deve lidar com erro ao carregar os livros', () => {
    bookServiceSpy.getBooks.and.returnValue(throwError(() => new Error('Erro')));
    component.loadBooks();
    expect(bookServiceSpy.getBooks).toHaveBeenCalled();
  });

  it('deve deletar um livro e recarregar a lista em caso de sucesso', () => {
    bookServiceSpy.deleteBook.and.returnValue(of({ success: true, data: 'ok' }));
    bookServiceSpy.getBooks.and.returnValue(of([]));
    component.deleteBook(mockBooks[0]);
    expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith('1');
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('deve exibir erro se a exclusão falhar', () => {
    bookServiceSpy.deleteBook.and.returnValue(
      throwError(() => ({ error: { error: 'Erro ao deletar livro' } }))
    );
    component.deleteBook(mockBooks[0]);
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao deletar livro'
    });
  });

  it('deve atualizar um livro com sucesso', () => {
    const updateData = {
      title: 'Book Updated',
      authorId: 'a1',
      genreId: 'g1'
    };

    bookServiceSpy.updateBook.and.returnValue(of({ success: true, data: 'ok' }));
    bookServiceSpy.getBooks.and.returnValue(of([]));

    component.updateBook(updateData, '1');

    expect(bookServiceSpy.updateBook).toHaveBeenCalledWith({
      id: '1',
      ...updateData
    });
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('deve exibir erro se a atualização falhar', () => {
    const updateData = {
      title: 'Book Updated',
      authorId: 'a1',
      genreId: 'g1'
    };

    bookServiceSpy.updateBook.and.returnValue(
      throwError(() => ({ error: { error: 'Erro ao atualizar livro' } }))
    );

    component.updateBook(updateData, '1');

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao atualizar livro'
    });
  });
});
