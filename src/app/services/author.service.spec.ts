import { TestBed } from '@angular/core/testing';

import { AuthorService } from './author.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api.interface';
import { Author } from '../models/author.model';

describe('AuthorService', () => {
  let service: AuthorService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/${environment.apiVersion}/authors`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorService],
    });

    service = TestBed.inject(AuthorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os autores', () => {
    const mockResponse: ApiResponse<Author[]> = {
      success: true,
      data: [
        { id: '1', name: 'Author 1' },
        { id: '2', name: 'Author 2' },
      ],
    };

    service.getAuthors().subscribe((authors) => {
      expect(authors.length).toBe(2);
      expect(authors[0].name).toBe('Author 1');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve criar um autor', () => {
    const newAuthor = { name: 'New Author' };
    const mockResponse: ApiResponse<string> = {
      success: true,
      data: 'created-id',
    };

    service.createAuthor(newAuthor).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data).toBe('created-id');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAuthor);
    req.flush(mockResponse);
  });

  it('deve atualizar um autor', () => {
    const updatedAuthor: Author = { id: '1', name: 'Updated Author' };
    const mockResponse: ApiResponse<string> = {
      success: true,
      data: 'updated-id',
    };

    service.updateAuthor(updatedAuthor).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data).toBe('updated-id');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedAuthor);
    req.flush(mockResponse);
  });

  it('deve deletar um autor', () => {
    const authorId = '1';
    const mockResponse: ApiResponse<string> = {
      success: true,
      data: 'deleted-id',
    };

    service.deleteAuthor(authorId).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.data).toBe('deleted-id');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
