import { Component } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BookModalComponent } from '../components/books/book-modal/book-modal.component';
import { BooksService } from '../services/books.service';
import { AddBookRequest } from '../shared/models/add-book-request.model';
import { Book } from '../shared/models/book.model';

interface IRange {
  value: Date[];
  label: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  books: Book[] = [];
  dateRangeModel: Date[] = [];
  ranges: IRange[] = [
    {
      value: [this.getFirstDayOfCurrentMonth(), this.getLastDayOfCurrentMonth()],
      label: 'For This Month'
    },
    {
      value: [this.getFirstDayOfCurrentYear(), this.getLastDayOfCurrentYear()],
      label: 'For This Year'
    }
  ];

  searchText: string = '';

  constructor(
    private booksService: BooksService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.booksService.getBooks()
      .subscribe({
        next: (books) => {
          this.books = this.getFilteredBooks(books);
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  getFilteredBooks(books: Book[]): Book[] {
    let result = [...books];

    if (result.length > 0) {
      result = this.filterByPublicationDate(result);
    }

    return result;
  }

  openModal(): void {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Add',
        submitBtnTitle: 'Add'
      }
    };

    const modalRef = this.modalService.show(BookModalComponent, initialState);
    if (modalRef && modalRef.content) {
      const onSubmitSub: Subscription = modalRef.content.onSubmit.subscribe((book: Book) => {
        this.addBook(book);
        onSubmitSub.unsubscribe();
      });
    }
  }

  searchByName(book: Book): string {
    return book.name;
  }

  private addBook(book: Book): void {
    let request = {
      name: book.name,
      publicationDate: book.publicationDate,
      description: book.description,
      numberOfPages: book.numberOfPages
    } as AddBookRequest;

    this.booksService.addBook(request)
      .subscribe({
        next: () => {
          this.getBooks();
          console.log('added');
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  private filterByPublicationDate(books: Book[]): Book[] {
    if (this.dateRangeModel && this.dateRangeModel.length != 0) {
      return books.filter(book => {
        let date = new Date(book.publicationDate);
        date.setHours(0, 0, 0, 0);
        let dateStr = date.toISOString();

        return dateStr >= this.dateRangeModel[0].toISOString() && dateStr <= this.dateRangeModel[1].toISOString()
      });
    }

    return books;
  }

  private getFirstDayOfCurrentMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private getLastDayOfCurrentMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  private getFirstDayOfCurrentYear(): Date {
    return new Date(new Date().getFullYear(), 0, 1);
  }

  private getLastDayOfCurrentYear(): Date {
    return new Date(new Date().getFullYear(), 11, 31);
  }
}
