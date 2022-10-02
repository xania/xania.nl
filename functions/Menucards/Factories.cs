using Newtonsoft.Json;
using System.Collections.Generic;

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

        public IList<ProductOption> Options { get; init; }

        public const string Type = "multi";
    }

    public class ProductOption : IOption
    {
        public string Value { get; init; }

        public const string Type = "single";
    }
}
