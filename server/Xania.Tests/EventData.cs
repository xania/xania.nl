using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Xania.Tests
{
    public interface IEventData
    {
    }

    public class EventEntity : IEventData
    {
        public JsonNode Id { get; }
        public JsonObject Content { get; }

        public EventEntity([DisallowNull] JsonNode id, [DisallowNull] JsonObject content)
        {
            Id = id;
            Content = content;
        }

        public static EventEntity Create(Type type, object obj)
        {
            JsonNode id = null;
            var content = new Dictionary<string, object>();
            foreach (var prop in type.GetProperties())
            {
                var propValue = prop.GetValue(obj);

                if (prop.Name == "Id")
                    id = JsonSerializer.SerializeToNode(propValue, prop.PropertyType);

                if (propValue == null)
                    continue;

                content.Add(prop.Name, propValue);
            }

            var jsonContent = JsonSerializer.SerializeToNode(content) as JsonObject;

            return new EventEntity(id, jsonContent);
        }
    }
}