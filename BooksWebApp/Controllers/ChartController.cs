using BooksWebApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChartController : ControllerBase
    {
        private readonly BooksContext _booksContext;

        public ChartController(BooksContext booksContext)
        {
            _booksContext = booksContext;
        }

        [HttpGet]
        [Route("number-of-books-by-year")]
        public async Task<IActionResult> GetNumberOfBooksByYearAsync()
        {
            var books = await _booksContext.Books.ToListAsync();
            var result = new Dictionary<string, int>();

            var years = books.Select(b => b.PublicationDate.Year).Distinct().ToList();
            foreach(var year in years)
            {
                var count = books.Count(b => b.PublicationDate.Year == year);
                result.Add(year.ToString(), count);
            }

            return Ok(result);
        }
    }
}
