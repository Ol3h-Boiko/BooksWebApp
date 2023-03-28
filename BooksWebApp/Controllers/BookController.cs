using BooksWebApp.Data;
using BooksWebApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly BooksContext _booksContext;

        public BookController(BooksContext booksContext)
        {
            _booksContext = booksContext;
        }

        [HttpGet]
        [Route("books")]
        public async Task<IActionResult> GetBooksAsync()
        {
            var books = await _booksContext.Books.ToListAsync();
            return Ok(books);
        }

        [HttpPost]
        [Route("add-book")]
        public async Task<IActionResult> AddBookAsync([FromBody] Book addBookRequest)
        {
            await _booksContext.Books.AddAsync(addBookRequest);
            await _booksContext.SaveChangesAsync();

            return Ok();
        }


        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetBookAsync([FromRoute] int id)
        {
            var book = await _booksContext.Books.FirstOrDefaultAsync(x => x.ID == id);

            if (book == null) {
                return NotFound();
            }

            return Ok(book);
        }

        [HttpPut]
        [Route("update-book")]
        public async Task<IActionResult> UpdateBookAsync([FromBody] Book updateBookRequest)
        {
            var book = await _booksContext.Books.FindAsync(updateBookRequest.ID);

            if (book == null) {
                return NotFound();
            }

            book.Name = updateBookRequest.Name;
            book.Description = updateBookRequest.Description;
            book.NumberOfPages = updateBookRequest.NumberOfPages;
            book.PublicationDate = updateBookRequest.PublicationDate;

            await _booksContext.SaveChangesAsync();

            return Ok(book);
        }

        [HttpDelete]
        [Route("delete-book/{id:int}")]
        public async Task<IActionResult> DeleteBookAsync([FromRoute] int id)
        {
            var book = await _booksContext.Books.FindAsync(id);

            if (book == null) {
                return NotFound();
            }

            _booksContext.Books.Remove(book);
            await _booksContext.SaveChangesAsync();

            return Ok();
        }
    }
}
