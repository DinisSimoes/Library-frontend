import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Book, BookRequest } from '../models/book.model';
import { ApiResponse } from '../interfaces/api.interface';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/${environment.apiVersion}/books`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os livros', () => {
    const dummyBooks: Book[] = [
      { id: '1', title: 'Livro A', authorId: '123', authorName: 'Autor A', genreName: 'Gênero A', genreId: '123' },
      { id: '2', title: 'Livro B', authorId: '456', authorName: 'Autor B', genreName: 'Gênero B', genreId: '987' },
    ];

    const response: ApiResponse<Book[]> = {
      success: true,
      data: dummyBooks,
    };

    service.getBooks().subscribe((books) => {
      expect(books.length).toBe(2);
      expect(books).toEqual(dummyBooks);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('deve criar um livro', () => {
    const newBook: Omit<BookRequest, 'id'> = {
      title: 'Novo Livro',
      authorId: '789',
      genreId: '456',
    };

    const response: ApiResponse<string> = {
      success: true,
      data: 'Livro criado com sucesso',
    };

    service.createBook(newBook).subscribe((res) => {
      expect(res.data).toBe('Livro criado com sucesso');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBook);
    req.flush(response);
  });

  it('deve atualizar um livro', () => {
    const updatedBook: BookRequest = {
      id: '1',
      title: 'Livro Atualizado',
      authorId: '123',
      genreId: '456',
    };

    const response: ApiResponse<string> = {
      success: true,
      data: 'Livro atualizado com sucesso',
    };

    service.updateBook(updatedBook).subscribe((res) => {
      expect(res.data).toBe('Livro atualizado com sucesso');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedBook);
    req.flush(response);
  });

   it('deve deletar um livro', () => {
    const response: ApiResponse<string> = {
      success: true,
      data: 'Livro deletado com sucesso',
    };

    service.deleteBook('1').subscribe((res) => {
      expect(res.data).toBe('Livro deletado com sucesso');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(response);
  });
});
