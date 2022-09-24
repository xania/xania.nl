namespace Xania.Functions.Menucards
{
    public static class Factories
    {
        public static MultiChoiceOption MultiChoice(string name, params ProductOption[] options)
        {
            return new MultiChoiceOption
            {
                Name = name,
                Options = options
            };
        }

        public static ProductOption Option(string value) => new ProductOption
        {
            Value = value
        };
    }

    public class MultiChoiceOption: IOption
    {
        public string Name { get; init; }
        public IOption[] Options { get; init; }
        public string Type => "multi";

        public readonly string dd = "asdfasdf";
    }
}
