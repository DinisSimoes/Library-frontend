import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthorsComponent } from './authors.component';
import { AuthorService } from '../services/author.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { of, throwError } from 'rxjs';

describe('AuthorsComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const authorSpy = jasmine.createSpyObj('AuthorService', [
      'getAuthors',
      'deleteAuthor',
      'updateAuthor',
    ]);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    authorSpy.getAuthors.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AuthorsComponent, HttpClientTestingModule],
      providers: [
        DialogService,
        { provide: AuthorService, useValue: authorSpy },
        { provide: MessageService, useValue: messageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    authorServiceSpy = TestBed.inject(
      AuthorService
    ) as jasmine.SpyObj<AuthorService>;
    messageServiceSpy = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar autores com sucesso', () => {
    const mockAuthors = [{ id: '1', name: 'Autor 1' }];
    authorServiceSpy.getAuthors.and.returnValue(of(mockAuthors));

    component.loadAuthors();

    expect(authorServiceSpy.getAuthors).toHaveBeenCalled();
    expect(component.authors).toEqual(mockAuthors);
  });

  it('deve tratar erro ao deletar autor', () => {
    const mockError = { error: { error: 'Não é possível deletar.' } };
    authorServiceSpy.deleteAuthor.and.returnValue(throwError(() => mockError));

    const mockAuthor = { id: '1', name: 'Autor Teste' };
    component.deleteAuthor(mockAuthor);

    expect(authorServiceSpy.deleteAuthor).toHaveBeenCalledWith('1');
    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não é possível deletar.',
      })
    );
  });

  it('deve atualizar autor com sucesso', () => {
    const mockAuthor = { id: '1', name: 'Atualizado' };
    authorServiceSpy.updateAuthor.and.returnValue(
      of({ success: true, data: 'Ok' })
    );

    component.updateAuthor({ name: 'Atualizado' }, '1');

    expect(authorServiceSpy.updateAuthor).toHaveBeenCalledWith(mockAuthor);
    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: 'success',
        detail: 'Autor atualizado com sucesso',
      })
    );
  });
});
