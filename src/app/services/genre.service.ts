import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Genre } from '../models/genre.model';
import { ApiResponse } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/genres`;

  constructor(private http: HttpClient) {}

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<ApiResponse<Genre[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  createGenre(genre: Omit<Genre, 'id'>): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, genre);
  }

  updateGenre(genre: Genre): Observable<ApiResponse<string>> {
    const url = `${this.apiUrl}/${genre.id}`;
    return this.http.put<ApiResponse<string>>(url, genre);
  }

  deleteGenre(id: string): Observable<ApiResponse<string>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<ApiResponse<string>>(url);
  }
}
