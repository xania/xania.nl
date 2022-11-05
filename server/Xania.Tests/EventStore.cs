namespace Xania.Tests
{
    public class EventStore
    {
        private readonly IList<Event> _events = new List<Event>();

        private void Add(long timeStamp, IEventData data, int type)
        {
            _events.Add(new Event(data, timeStamp, type));
        }

        private IEnumerable<Event> Enumerate(long timeStamp)
        {
            foreach (var evnt in _events)
            {
                if (evnt.TimeStamp <= timeStamp)
                    yield return evnt;
            }
        }

        public Session CreateSession()
        {
            return new Session(this);
        }

        public class Session : IDisposable
        {
            private readonly long _timeStamp;
            private readonly EventStore _store;

            public Session(EventStore store)
            {
                _timeStamp = DateTime.Now.Ticks;
                _store = store;
            }

            public void Add(IEventData data, int type)
            {
                _store.Add(_timeStamp, data, type);
            }

            public void Dispose()
            {
            }

            public IEnumerable<Event> Enumerate()
            {
                return _store.Enumerate(_timeStamp);
            }
        }


        public class Event
        {
            public long TimeStamp { get; }
            public IEventData Data { get; }
            public int Type { get; }

            public Event(IEventData data, long timeStamp, int type)
            {
                Data = data;
                TimeStamp = timeStamp;
                Type = type;
            }
        }
    }
}