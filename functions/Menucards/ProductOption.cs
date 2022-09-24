namespace Xania.Functions.Menucards
{
    public class ProductOption: IOption
    {
        public string Value { get; init; }
        public string Type => "product";
    }
}
