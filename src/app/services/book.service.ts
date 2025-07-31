import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/api.interface';
import { map, Observable } from 'rxjs';
import { Book, BookRequest } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/books`;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http
      .get<ApiResponse<Book[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  createBook(book: Omit<BookRequest, 'id'>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, book);
  }

  updateBook(book: BookRequest): Observable<ApiResponse<string>> {
    const url = `${this.apiUrl}/${book.id}`;
    return this.http.put<ApiResponse<string>>(url, book);
  }

  deleteBook(id: string): Observable<ApiResponse<string>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<ApiResponse<string>>(url);
  }
}
