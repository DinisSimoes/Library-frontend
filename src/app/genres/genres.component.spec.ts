import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresComponent } from './genres.component';
import { GenreService } from '../services/genre.service';
import { MessageService } from 'primeng/api';
import { Genre } from '../models/genre.model';
import { DialogService } from 'primeng/dynamicdialog';
import { of, throwError } from 'rxjs';

describe('GenresComponent', () => {
  let component: GenresComponent;
  let fixture: ComponentFixture<GenresComponent>;
  let genreServiceSpy: jasmine.SpyObj<GenreService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockGenres: Genre[] = [
    { id: '1', name: 'Ficção' },
    { id: '2', name: 'Aventura' }
  ];

  beforeEach(async () => {
    const genreSpy = jasmine.createSpyObj('GenreService', ['getGenres', 'updateGenre', 'deleteGenre']);
    const msgSpy = jasmine.createSpyObj('MessageService', ['add']);

    genreSpy.getGenres.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [GenresComponent],
      providers: [
        DialogService,
        { provide: GenreService, useValue: genreSpy },
        { provide: MessageService, useValue: msgSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenresComponent);
    component = fixture.componentInstance;
    genreServiceSpy = TestBed.inject(GenreService) as jasmine.SpyObj<GenreService>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os gêneros com sucesso', () => {
    genreServiceSpy.getGenres.and.returnValue(of(mockGenres));
    component.loadGenres();
    expect(genreServiceSpy.getGenres).toHaveBeenCalled();
    expect(component.genres.length).toBe(2);
  });

  it('deve lidar com erro ao carregar os gêneros', () => {
    genreServiceSpy.getGenres.and.returnValue(throwError(() => new Error('Erro')));
    component.loadGenres();
    expect(genreServiceSpy.getGenres).toHaveBeenCalled();
  });

  it('deve atualizar gênero com sucesso', () => {
    const newGenre = { name: 'Novo Nome' };
    genreServiceSpy.updateGenre.and.returnValue(of({ success: true, data: 'ok' }));
    genreServiceSpy.getGenres.and.returnValue(of([]));

    component.updateGenre(newGenre, '1');

    expect(genreServiceSpy.updateGenre).toHaveBeenCalledWith({
      id: '1',
      name: 'Novo Nome'
    });
    expect(messageServiceSpy.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success',
      detail: 'Genero salvo com sucesso'
    }));
  });

  it('deve exibir erro ao falhar em atualizar gênero', () => {
    genreServiceSpy.updateGenre.and.returnValue(
      throwError(() => ({ error: { error: 'Erro ao atualizar' } }))
    );

    component.updateGenre({ name: 'Erro' }, '1');

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao atualizar'
    });
  });

  it('deve deletar gênero com sucesso', () => {
    genreServiceSpy.deleteGenre.and.returnValue(of({ success: true, data: 'ok' }));
    genreServiceSpy.getGenres.and.returnValue(of([]));

    component.deleteGenre(mockGenres[0]);

    expect(genreServiceSpy.deleteGenre).toHaveBeenCalledWith('1');
    expect(messageServiceSpy.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      detail: 'Genero salvo com sucesso'
    }));
  });

  it('deve exibir erro ao falhar em deletar gênero', () => {
    genreServiceSpy.deleteGenre.and.returnValue(
      throwError(() => ({ error: { error: 'Erro ao deletar' } }))
    );

    component.deleteGenre(mockGenres[0]);

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao deletar'
    });
  });
});
