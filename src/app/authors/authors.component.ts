import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogAddEditComponent } from '../shared/dialogs/dialog-add-edit/dialog-add-edit.component';
import { MessageService } from 'primeng/api';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Author } from '../models/author.model';
import { AuthorService } from '../services/author.service';

@Component({
  selector: 'app-authors',
  imports: [TableModule, CommonModule, LucideAngularModule],
  standalone: true,
  providers: [DialogService],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss'
})
export class AuthorsComponent {

  authors: Author[] = [];
  ref: DynamicDialogRef | undefined;
  
constructor(private dialogService: DialogService, private messageService: MessageService, private authorService: AuthorService) {
  this.loadAuthors();
}

loadAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
      },
      error: (err) => {
      },
    });
  }


  editAuthor(author: Author){
    console.log(author);
       this.ref = this.dialogService.open(DialogAddEditComponent, {
      header: `Editar Autor ${author.name}`,
      width: '30%',
      data: {
        name: author.name,
        type: 'author'
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        console.log(result);
        this.updateAuthor(result, author.id);
      }
    });
  }
  deleteAuthor(author: Author) {
    this.authorService.deleteAuthor(author.id).subscribe({
      next: (response) => {
        this.showSuccess('Autor');
        this.loadAuthors();
      },
      error: (error) => {
        this.showError(error.error.error);
      }
    });
  }

  updateAuthor(newAuthor: any, idAuthor: string) {
    const author: Author = {
      id: idAuthor,
      name: newAuthor.name
    };
    this.authorService.updateAuthor(author).subscribe({
    next: (response) => {
      console.log('Book criado com sucesso:', response.data);
      this.showSuccess('Autor');
      this.loadAuthors();
    },
    error: (error) => {
      this.showError(error.error.error);
    }
  });
  }

  showSuccess(tag: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${tag} atualizado com sucesso`,
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
