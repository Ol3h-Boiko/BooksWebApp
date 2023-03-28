import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddBookRequest } from '../shared/models/add-book-request.model';
import { Book } from '../shared/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private _baseUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this._baseUrl + 'api/book/books');
  }

  addBook(addBookRequest: AddBookRequest): Observable<Book> {
    return this.http.post<Book>(this._baseUrl + 'api/book/add-book', addBookRequest);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(this._baseUrl + 'api/book/' + id);
  }

  updateBook(updateBookRequest: Book): Observable<Book> {
    return this.http.put<Book>(this._baseUrl + 'api/book/update-book', updateBookRequest);
  }

  deleteBook(id: number): Observable<Book> {
    return this.http.delete<Book>(this._baseUrl + 'api/book/delete-book/' + id);
  }
}
