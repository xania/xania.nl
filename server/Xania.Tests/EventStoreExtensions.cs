using System.Text.Json;
using System.Text.Json.Nodes;

namespace Xania.Tests
{
    public static class EventStoreExtensions
    {
        public static void AddPerson(this EventStore.Session session, Person obj)
        {
            session.Add(obj.ToEventData(), (int)AppEventType.PersonCreated);
        }

        public static void UpdatePerson(this EventStore.Session session, Guid id, JsonObject data)
        {
            var eventData = new EventEntity(
                JsonSerializer.SerializeToNode(id),
                data);
            session.Add(eventData, (int)AppEventType.PersonUpdated);
        }

        public static IEventData ToEventData<T>(this T obj)
        {
            return ToJsonNode(typeof(T), obj);
        }


        public static IEventData ToJsonNode(Type type, object entity)
        {
            return EventEntity.Create(type, entity);
        }

        public static T ToObject<T>(this JsonNode data)
        {
            return data.Deserialize<T>();
        }

        public static EntityStore Reduce(this EventStore.Session session)
        {
            var entityStore = new EntityStore();

            foreach (var evnt in session.Enumerate())
            {
                var type = (AppEventType)evnt.Type;
                switch (type)
                {
                    case AppEventType.PersonCreated:
                        if (evnt.Data is EventEntity entity)
                            entityStore.Add(entity.Id, entity.Content);

                        break;
                    case AppEventType.PersonUpdated:
                        if (evnt.Data is EventEntity entity2)
                            entityStore.Update(entity2.Id, entity2.Content);
                        break;
                }
            }

            return entityStore;
        }
    }

    public enum AppEventType : byte
    {
        PersonUpdated,
        PersonCreated
    }
}