import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BooksService } from '../../../services/books.service';
import { Book } from '../../../shared/models/book.model';
import { BookModalComponent } from '../book-modal/book-modal.component';

enum SortBy {
  Name = 'name',
  PublicationDate = 'publicationDate',
  NumberOfPages = 'numberOfPages',
}

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit {
  @Input() books: Book[] = [];
  @Input() searchedWord: string = '';

  @Output() tableChangedEvent = new EventEmitter();

  isAsc: boolean = true;
  sortBy?: SortBy = undefined;
  selectedBookId: number = -1;

  SortBy = SortBy;

  constructor(
    private booksService: BooksService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  sort(books: Book[], sortBy?: SortBy): Book[] {
    if (!sortBy) {
      return books;
    }

    let result = books.sort((a, b) => {
      const nameA = sortBy == SortBy.NumberOfPages ? a[sortBy] : a[sortBy].toString().toUpperCase();
      const nameB = sortBy == SortBy.NumberOfPages ? b[sortBy] : b[sortBy].toString().toUpperCase();
      if (nameA < nameB) {
        return this.isAsc ? 1 : -1;
      }
      if (nameA > nameB) {
        return this.isAsc ? -1 : 1;
      }

      return 0;
    });

    return result;
  }

  changeSort(selectedSortBy: SortBy): void {
    if (this.sortBy == selectedSortBy) {
      this.isAsc = !this.isAsc;
    }
    else {
      this.sortBy = selectedSortBy;
      this.isAsc = true;
    }
  }

  selectBook(bookId: number): void {
    if (this.selectedBookId === bookId) {
      this.selectedBookId = -1;
    }
    else {
      this.selectedBookId = bookId;
    }
  }

  openModal(bookId: number): void {
    const book = this.getFormData(bookId);

    const initialState: ModalOptions = {
      initialState: {
        title: 'Edit',
        submitBtnTitle: 'Save changes',
        book: book
      }
    };

    const modalRef = this.modalService.show(BookModalComponent, initialState);
    if (modalRef && modalRef.content) {
      const onSubmitSub: Subscription = modalRef.content.onSubmit.subscribe((book: Book) => {
        this.updateBook(book);
        onSubmitSub.unsubscribe();
      });
    }
  }

  deleteBook(bookId: number): void {
    this.booksService.deleteBook(bookId)
      .subscribe({
        next: () => {
          this.tableChangedEvent.emit();
          console.log('deleted');
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  private getFormData(bookId: number): Book {
    const book = this.books.find(b => b.id === bookId);
    if (!book) {
      return {} as Book;
    }

    const bookClone = Object.assign({}, book);
    bookClone.publicationDate = dayjs(bookClone.publicationDate).format('DD-MM-YYYY');

    return bookClone;
  }

  private updateBook(book: Book): void {
    this.booksService.updateBook(book)
      .subscribe({
        next: () => {
          this.tableChangedEvent.emit();
          console.log('updated');
        },
        error: (response) => {
          console.log(response);
        }
      });
  }
}
