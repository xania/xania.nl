using System.Collections.Generic;

namespace Xania.Functions.Menucards
{
    public class Product
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public IList<IOption> Options { get; } = new List<IOption>();
        public int Id { get; internal set; }
    }

    [SubTypes(typeof(MultiChoiceOption), typeof(ProductOption))]
    public interface IOption: IDescriminatedUnion
    {

    }
}
