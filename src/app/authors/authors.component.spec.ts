import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsComponent } from './authors.component';
import { AuthorService } from '../services/author.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

describe('AuthorsComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;
  let authorServiceSpy: jasmine.SpyObj<AuthorService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const authorSpy = jasmine.createSpyObj('AuthorService', ['getAuthors', 'deleteAuthor', 'updateAuthor']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [AuthorsComponent],
      providers: [
        DialogService,
        { provide: AuthorService, useValue: authorSpy },
        { provide: MessageService, useValue: messageSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    authorServiceSpy = TestBed.inject(AuthorService) as jasmine.SpyObj<AuthorService>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
