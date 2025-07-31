import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Book, BookRequest } from '../models/book.model';
import { DialogAddEditComponent } from '../shared/dialogs/dialog-add-edit/dialog-add-edit.component';
import { BookService } from '../services/book.service';
import { generate } from 'rxjs';

@Component({
  selector: 'app-books',
  imports: [TableModule, CommonModule, LucideAngularModule],
  templateUrl: './books.component.html',
  providers: [DialogService],
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  books: Book[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private bookService: BookService
  ) {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {},
    });
  }

  editBook(book: Book) {
    console.log(book);
    this.ref = this.dialogService.open(DialogAddEditComponent, {
      header: `Editar Livro ${book.title}`,
      width: '30%',
      data: {
        name: book.title,
        author: { id: book.authorId, name: book.authorName },
        genre: { id: book.genreId, name: book.genreName },
        type: 'books',
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.updateBook(result, book.id);
      }
    });
  }

  updateBook(result: any, bookId: string) {
    const book: BookRequest = {
      id: bookId,
      title: result.title,
      authorId: result.authorId,
      genreId: result.genreId,
    };
    this.bookService.updateBook(book).subscribe({
      next: (response) => {
        this.showSuccess('Livro');
        this.loadBooks();
      },
      error: (error) => {
        this.showError(error.error.error);
      },
    });
  }
  deleteBook(book: Book) {
    this.bookService.deleteBook(book.id).subscribe({
      next: (response) => {
        this.showSuccess('Livro');
        this.loadBooks();
      },
      error: (error) => {
        this.showError(error.error.error);
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

  showError(erro: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: erro,
    });
  }
}
