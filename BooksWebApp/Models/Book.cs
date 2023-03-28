namespace BooksWebApp.Models
{
    public class Book
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public DateTime PublicationDate { get; set; }

        public string Description { get; set; }

        public int NumberOfPages { get; set; }
    }
}
