import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { DialogAddEditComponent } from '../shared/dialogs/dialog-add-edit/dialog-add-edit.component';
import { Genre } from '../models/genre.model';
import { GenreService } from '../services/genre.service';

@Component({
  selector: 'app-genres',
  imports: [TableModule, CommonModule, LucideAngularModule],
  standalone: true,
  providers: [DialogService],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss',
})
export class GenresComponent {
  genres: Genre[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private genreService: GenreService
  ) {
    this.loadGenres();
  }

  loadGenres() {
    this.genreService.getGenres().subscribe({
      next: (data) => {
        this.genres = data;
      },
      error: (err) => {},
    });
  }

  editGenre(genre: Genre) {
    console.log(genre);
    this.ref = this.dialogService.open(DialogAddEditComponent, {
      header: `Editar Genero ${genre.name}`,
      width: '30%',
      data: {
        name: genre.name,
        type: 'genres',
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.updateGenre(result, genre.id);
      }
    });
  }

  updateGenre(newGenre: any, idGenre: string) {
    const genre: Genre = {
      id: idGenre,
      name: newGenre.name,
    };
    this.genreService.updateGenre(genre).subscribe({
      next: (response) => {
        this.showSuccess('Genero');
        this.loadGenres();
      },
      error: (error) => {
        this.showError(error.error.error);
      },
    });
  }
  deleteGenre(genre: Genre) {
    this.genreService.deleteGenre(genre.id).subscribe({
      next: (response) => {
        this.showSuccess('Genero');
        this.loadGenres();
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
