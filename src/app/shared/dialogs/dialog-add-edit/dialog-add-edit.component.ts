import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Select, SelectModule } from 'primeng/select';
import { AuthorService } from '../../../services/author.service';
import { GenreService } from '../../../services/genre.service';
import { Author } from '../../../models/author.model';
import { Genre } from '../../../models/genre.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-add-edit',
  imports: [Button, CommonModule, SelectModule, FormsModule, Select],
  standalone: true,
  templateUrl: './dialog-add-edit.component.html',
  styleUrl: './dialog-add-edit.component.scss',
})
export class DialogAddEditComponent {
  name: string = '';
  type: string = '';

  authors: Author[] = [];
  selectedAuthor: Author | undefined;

  genres: Genre[] = [];
  selectedGenre: Genre | undefined;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public authorService: AuthorService,
    public genreService: GenreService
  ) {
    this.name = config.data?.name ?? '';
    this.type = config.data?.type ?? '';
    this.selectedAuthor = config.data?.author ?? undefined;
    this.selectedGenre = config.data?.genre ?? undefined;
  }

  ngOnInit() {
    if (this.type === 'books') {
      this.loadAuthors();
      this.loadGenres();
    }
  }

  loadAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (data) => (this.authors = data),
      error: (err) => console.error('Erro ao buscar autores:', err),
    });
  }

  loadGenres() {
    this.genreService.getGenres().subscribe({
      next: (data) => (this.genres = data),
      error: (err) => console.error('Erro ao buscar generos:', err),
    });
  }

  close() {
    this.ref.close();
  }

  save() {
    if (this.type === 'books') {
      this.ref.close({
        title: this.name,
        authorId: this.selectedAuthor?.id,
        genreId: this.selectedGenre?.id,
      });
    } else {
      this.ref.close({ name: this.name });
    }
  }
}
