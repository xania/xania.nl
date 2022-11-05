using System.Text.Json;
using System.Text.Json.Nodes;
using Xunit.Abstractions;

namespace Xania.Tests
{
    public class UnitTest1
    {
        private readonly ITestOutputHelper _testOutput;
        private readonly Guid _personId;
        private readonly EventStore.Session _session;

        public UnitTest1(ITestOutputHelper testOutput)
        {
            _testOutput = testOutput;

            _personId = Guid.NewGuid();

            var person = new Person
            {
                Id = _personId,
                FirstName = "Ibrahim",
                LastName = "ben Salah"
            };

            _session = new EventStore().CreateSession();
            _session.AddPerson(person);

            for (var i = 0; i < 10000; i++)
            {
                if (i % 100 == 0)
                {
                    var updateFirstName = JsonSerializer.SerializeToNode(new
                    {
                        FirstName = "Ramy" + i
                    }) as JsonObject;
                    _session.UpdatePerson(person.Id, updateFirstName);
                }
                else
                {
                    _session.AddPerson(new Person
                    {
                        Id = Guid.NewGuid(),
                        FirstName = "bla",
                        LastName = "alb"
                    });
                }
            }

        }

        [Fact]
        public void Test1()
        {
            var store = _session.Reduce();
            _testOutput.WriteLine(store[_personId].ToJsonString());
        }
    }

    public class Person
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
    }

}