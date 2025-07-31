import { TestBed } from '@angular/core/testing';

import { GenreService } from './genre.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api.interface';
import { Genre } from '../models/genre.model';

describe('GenreService', () => {
  let service: GenreService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/${environment.apiVersion}/genres`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GenreService],
    });

    service = TestBed.inject(GenreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar todos os gêneros', () => {
    const dummyGenres: Genre[] = [
      { id: '1', name: 'Ficção Científica' },
      { id: '2', name: 'Romance' },
    ];

    const response: ApiResponse<Genre[]> = {
      success: true,
      data: dummyGenres,
    };

    service.getGenres().subscribe((genres) => {
      expect(genres.length).toBe(2);
      expect(genres).toEqual(dummyGenres);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('deve criar um gênero', () => {
    const newGenre: Omit<Genre, 'id'> = { name: 'Terror' };

    const response: ApiResponse<string> = {
      success: true,
      data: 'Gênero criado com sucesso',
    };

    service.createGenre(newGenre).subscribe((res) => {
      expect(res.data).toBe('Gênero criado com sucesso');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newGenre);
    req.flush(response);
  });

  it('deve atualizar um gênero', () => {
    const updatedGenre: Genre = { id: '1', name: 'Ficção' };

    const response: ApiResponse<string> = {
      success: true,
      data: 'Gênero atualizado com sucesso',
    };

    service.updateGenre(updatedGenre).subscribe((res) => {
      expect(res.data).toBe('Gênero atualizado com sucesso');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedGenre);
    req.flush(response);
  });

  it('deve atualizar um gênero', () => {
    const updatedGenre: Genre = { id: '1', name: 'Ficção' };

    const response: ApiResponse<string> = {
      success: true,
      data: 'Gênero atualizado com sucesso',
    };

    service.updateGenre(updatedGenre).subscribe((res) => {
      expect(res.data).toBe('Gênero atualizado com sucesso');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedGenre);
    req.flush(response);
  });
});
