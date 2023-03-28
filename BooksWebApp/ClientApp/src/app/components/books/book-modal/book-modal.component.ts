import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Book } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.css']
})
export class BookModalComponent implements OnInit {
  onSubmit: Subject<Book> = new Subject();

  book?: Book;

  title?: string;
  submitBtnTitle?: string;
  submitted: boolean = false;

  bookForm = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    publicationDate: ['', Validators.required],
    description: ['', Validators.required],
    numberOfPages: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.book) {
      this.bookForm.setValue(this.book);
    }
  }

  get controls() { return this.bookForm.controls; }

  submit(): void {
    this.submitted = true;

    if (this.bookForm.invalid) {
      return;
    }

    const book = this.bookForm.value as Book;
    book.publicationDate = dayjs(book.publicationDate).utc(true).format();

    this.onSubmit.next(book);
    this.bsModalRef.hide();
  }
}
