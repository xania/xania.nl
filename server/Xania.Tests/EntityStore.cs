using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Xania.Tests
{
    public class EntityStore : IEqualityComparer<JsonNode>, IEnumerable<JsonObject>
    {
        private readonly IDictionary<JsonNode, JsonObject> _entities;

        public EntityStore()
        {
            _entities = new Dictionary<JsonNode, JsonObject>(this);
        }

        public JsonObject this[JsonNode id] => _entities[id];

        public void Add(JsonNode id, JsonObject content)
        {
            _entities.Add(id, content);
        }

        public bool Equals(JsonNode x, JsonNode y)
        {
            if (x == null && y == null)
                return false;

            if (x is JsonValue vx && y is JsonValue vy)
            {
                return ((Guid)vx) == (Guid)vy;
            }

            return false;
        }

        public IEnumerator<JsonObject> GetEnumerator()
        {
            return _entities.Values.GetEnumerator();
        }

        public int GetHashCode([DisallowNull] JsonNode obj)
        {
            return 0;
        }

        public JsonObject Update(JsonNode id, JsonObject updates)
        {

            return _entities[id] = Merge(_entities[id], updates);


            static JsonObject Merge(JsonObject main, JsonObject update)
            {
                var retval = new JsonObject();
                foreach (var kvp in main)
                {
                    var propName = kvp.Key;
                    if (update.TryGetPropertyValue(propName, out var updateValue))
                    {
                        if (updateValue is JsonValue v)
                        {
                            retval.Add(propName, Clone(v));
                        }
                    }
                    else
                    {
                        retval.Add(propName, Clone(kvp.Value));
                    }
                }
                return retval;
            }

            static JsonNode Clone([DisallowNull] JsonNode node)
            {
                return JsonSerializer.Deserialize<JsonNode>(node);
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}