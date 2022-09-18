using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xania.Functions.Menucards
{
    public class MenuCard
    {
        public IEnumerable<Dish> Dishes { get; set; }
    }

    public class Dish
    {
        public string Title { get; internal set; }
        public string Description { get; internal set; }
        public decimal Price { get; internal set; }
    }
}
