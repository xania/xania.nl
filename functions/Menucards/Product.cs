using System.Collections.Generic;

namespace Xania.Functions.Menucards
{
    public class Product
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public IList<object> Options { get; } = new List<object>();
        public int Id { get; internal set; }
    }
}
