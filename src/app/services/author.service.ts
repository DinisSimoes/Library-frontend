import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Author } from '../models/author.model';
import { ApiResponse } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/authors`;

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http
      .get<ApiResponse<Author[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  createAuthor(author: Omit<Author, 'id'>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, author);
  }

  updateAuthor(author: Author): Observable<ApiResponse<string>> {
    const url = `${this.apiUrl}/${author.id}`;
    return this.http.put<ApiResponse<string>>(url, author);
  }

  deleteAuthor(id: string): Observable<ApiResponse<string>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<ApiResponse<string>>(url);
  }
}
