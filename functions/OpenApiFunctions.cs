using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Writers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Xania.Functions
{
    public class OpenApiOperationAttribute : Attribute
    {
    }
    public class OpenApiRequestBodyAttribute : Attribute
    {
        public OpenApiRequestBodyAttribute(Type type)
        {
            this.Type = type;
        }

        public Type Type { get; set; }
    }

    public class OpenApiResponseBodyAttribute : Attribute
    {
        public OpenApiResponseBodyAttribute(Type type)
        {
            this.Type = type;
        }

        public Type Type { get; set; }
    }

    public static class OpenApiFunctions
    {

        public static JsonResult Json(object value)
        {
            return new JsonResult(value, JsonSerializerSettings);
        }

        public static JsonSerializerSettings JsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings
        {
            ContractResolver = new MyContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            },

        };

        public static OpenApiSchema Enrich(this OpenApiSchema schema, PropertyInfo p)
        {
            schema.Nullable = p.PropertyType.IsClass ||
                (p.PropertyType.IsValueType && p.PropertyType.IsGenericType && p.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>));
            schema.ReadOnly = !p.CanWrite;

            if (p.GetMethod.IsStatic)
            {
                var value = p.GetValue(null);
                schema.Type = value + "";
            }

            return schema;
        }

        static HttpTriggerAttribute GetHttpTrigger(MethodInfo method)
        {
            var parameters = method.GetParameters();
            foreach (var p in parameters)
            {
                var trigger = p.GetCustomAttribute<HttpTriggerAttribute>();
                if (trigger != null)
                {
                    return trigger;
                }
            }
            return null;
        }

        private static (OpenApiRequestBody reqBody, Type refType) GetOperationRequestBody(MethodInfo method)
        {
            var attr = method.GetCustomAttribute<OpenApiRequestBodyAttribute>();
            if (attr == null) return (null, null);

            var requestType = attr.Type.Name;
            return (new OpenApiRequestBody
            {
                Content =
                {
                    ["application/json"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Reference = new OpenApiReference()
                            {
                                Id = requestType,
                                Type = ReferenceType.Schema
                            }
                        }
                    },
                }
            }, attr.Type);
        }

        private static (OpenApiResponses responses, Type refType) GetOperationResponses(MethodInfo method)
        {
            var (schema, refType) = GetResponseType(method);
            if (schema == null) return (null, null);

            return (new OpenApiResponses
            {
                ["200"] = new OpenApiResponse
                {
                    Description = "Success",
                    Content = new Dictionary<string, OpenApiMediaType>
                    {
                        ["application/json"] = new OpenApiMediaType
                        {
                            Schema = schema
                        }
                    }
                }
            }, refType);
        }

        private static (OpenApiSchema schema, Type refType) GetResponseType(MethodInfo method)
        {
            var attr = method.GetCustomAttribute<OpenApiResponseBodyAttribute>();
            if (attr != null)
            {
                return Unwrap(attr.Type);
            }


            var returnType = method.ReturnType;
            if (returnType == null)
                return (null, null);

            return Unwrap(returnType);


            static (OpenApiSchema schema, Type refType) Unwrap(Type type)
            {
                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Task<>))
                    return Unwrap(type.GetGenericArguments()[0]);

                if (type.Assembly == typeof(IActionResult).Assembly)
                    return (null, null);

                if (type == typeof(byte[]))
                    return (new OpenApiSchema()
                    {
                        Type = "string",
                        Format = "byte"
                    }, null);

                return (new OpenApiSchema()
                {
                    Reference = new OpenApiReference()
                    {
                        Id = type.Name,
                        Type = ReferenceType.Schema
                    }
                }, type);
            }
        }

        static IEnumerable<(string route, OperationType type, OpenApiOperation op, Type[] refTypes)> ResolveOperations(Assembly asm)
        {
            foreach (var type in asm.DefinedTypes)
            {
                foreach (var method in type.GetMethods())
                {
                    if (method.GetCustomAttribute<OpenApiOperationAttribute>() != null)
                    {
                        var trigger = GetHttpTrigger(method);
                        if (trigger != null && trigger.Route != null)
                        {
                            var (responses, refType) = GetOperationResponses(method);
                            var (requestBody, reqRefType) = GetOperationRequestBody(method);
                            var operation = new OpenApiOperation
                            {
                                Parameters = new OpenApiParameter[0],
                                RequestBody = requestBody,
                                Responses = responses
                            };

                            var path = "/api/" + trigger.Route;
                            foreach (var tm in trigger.Methods)
                            {
                                if (string.Equals(tm, "get", StringComparison.InvariantCultureIgnoreCase))
                                {
                                    yield return (path, OperationType.Get, operation, new Type[] { refType, reqRefType });
                                }
                                else if (string.Equals(tm, "post", StringComparison.InvariantCultureIgnoreCase))
                                {
                                    yield return (path, OperationType.Post, operation, new Type[] { refType, reqRefType });
                                }

                            }
                        }
                    }
                }
            }
        }


        [FunctionName("openapi")]
        public static IActionResult OpenApi(
                [HttpTrigger(AuthorizationLevel.Function, "get", Route = "openapi")] HttpRequest req,
                ExecutionContext context,
                ILogger log)
        {
            var refTypes = new HashSet<Type>();
            var paths = new OpenApiPaths();
            foreach (var g in ResolveOperations(typeof(OpenApiFunctions).Assembly).GroupBy(e => e.route))
            {
                foreach (var refType in g.SelectMany(e => e.refTypes))
                {
                    if (refType != null)
                        refTypes.Add(refType);
                }

                var route = g.Key;
                var ops = g.ToDictionary(e => e.type, e => e.op);
                new OpenApiPathItem
                {
                    Operations = ops
                };
                paths.Add(g.Key, new OpenApiPathItem
                {
                    Operations = ops
                });
            }


            req.HttpContext.Response.ContentType = "application/json";
            var visited = new HashSet<Type>();
            var document = new OpenApiDocument
            {
                Info = new OpenApiInfo
                {
                    Version = "1.0.0",
                    Title = "Xania OpenApi Client",
                },
                Servers = new List<OpenApiServer> {
                    new OpenApiServer { Url = "" }
                },
                Paths = new OpenApiPaths(paths)
                {
                },
                Components = new OpenApiComponents
                {
                    Schemas = GetObjectSchemas(refTypes)
                }
            };

            using var sw = new StringWriter();
            var oaw = new OpenApiJsonWriter(sw);

            document.SerializeAsV3(oaw);
            oaw.Flush();
            return new ContentResult()
            {
                Content = sw.ToString(),
            };
        }

        private static IDictionary<string, OpenApiSchema> GetObjectSchemas(HashSet<Type> refTypes)
        {
            var result = new Dictionary<string, OpenApiSchema>(); // .ToDictionary(e => ToCamelCase(e.Name), GetObjectSchema)
            var stack = new Stack<Type>(refTypes);
            var visited = new HashSet<Type>();
            var assemblies = new HashSet<Assembly>() { typeof(OpenApiFunctions).Assembly };
            var alltypes = assemblies.SelectMany(asm => asm.DefinedTypes).ToArray();
            while (stack.Any())
            {
                var curr = stack.Pop();
                if (!visited.Add(curr) || !assemblies.Contains(curr.Assembly))
                    continue;


                var schemaName = curr.Name;

                if (curr.IsAbstract || curr.IsInterface)
                {
                    var concreteTypes = alltypes.Where(t => t.IsAssignableTo(curr) && t.IsClass && !t.IsAbstract && !t.IsInterface).ToArray();
                    result[schemaName] = new OpenApiSchema
                    {
                        OneOf = concreteTypes.Select(t => new OpenApiSchema
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.Schema,
                                Id = t.Name
                            }
                        }).ToArray()
                    };
                    foreach(var c in concreteTypes)
                        stack.Push(c);

                    continue;
                }


                var schema = result[schemaName] = new OpenApiSchema
                {
                    Type = "object",
                    Properties = new Dictionary<string, OpenApiSchema>(),
                    Required = new HashSet<string>()
                };

                foreach (var field in curr.GetFields())
                {
                    if (field.IsLiteral)
                    {
                        var fieldName = ToCamelCase(field.Name);
                        var value = field.GetRawConstantValue();

                        if (value != null)
                        {
                            schema.Properties[fieldName] = new OpenApiSchema
                            {
                                Enum = new[] { new OpenApiString(value.ToString()) },
                                Nullable = false,
                                ReadOnly = true,
                            };
                            schema.Required.Add(fieldName);
                        }
                    }
                    else
                    {
                        AddProperty(field.Name, field.FieldType, field.IsLiteral);
                    }
                }

                foreach (var prop in curr.GetProperties())
                    AddProperty(prop.Name, prop.PropertyType, !prop.CanWrite);

                void AddProperty(string name, Type type, bool isReadOnly)
                {
                    var propName = ToCamelCase(name);
                    var (referencedTypes, propSchema) = GetPropertySchema(type);

                    propSchema.Nullable = type.IsClass ||
                        (type.IsValueType && type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>));
                    propSchema.ReadOnly = isReadOnly;

                    schema.Properties.Add(propName, propSchema);
                    schema.Required.Add(propName);

                    if (referencedTypes != null)
                        foreach (var refType in referencedTypes)
                            stack.Push(refType);
                }
            }

            return result;
        }

        private static string ToCamelCase(string name)
        {
            if (string.IsNullOrEmpty(name))
                return name;

            return Char.ToLower(name[0]) + name.Substring(1);
        }

        private static (Type[], OpenApiSchema) GetPropertySchema(Type type)
        {
            if (type == typeof(string))
                return (null, new OpenApiSchema
                {
                    Type = "string"
                });

            if (type == typeof(int))
                return (null, new OpenApiSchema
                {
                    Type = "integer",
                    Format = "in32"
                });

            if (type == typeof(double))
                return (null, new OpenApiSchema
                {
                    Type = "number",
                    Format = "double"
                });

            if (type == typeof(float))
                return (null, new OpenApiSchema
                {
                    Type = "number",
                    Format = "float"
                });

            if (type == typeof(bool))
                return (null, new OpenApiSchema
                {
                    Type = "boolean"
                });

            if (type == typeof(decimal))
                return (null, new OpenApiSchema
                {
                    Type = "number",
                    Format = "double"
                });

            if (type == typeof(DateTime))
            {
                return (null, new OpenApiSchema
                {
                    Type = "date",
                });
            }

            if (IsEnumerableType(type, out var elementType))
            {
                var (types, itemsSchema) = GetPropertySchema(elementType);
                return (Append(types, elementType), new OpenApiSchema
                {
                    Type = "array",
                    Items = itemsSchema,
                    Nullable = true,
                    ReadOnly = true,
                });

                static Type[] Append(Type[] types, Type type)
                {
                    if (types == null) return new[] { type };
                    return types.Append(type).ToArray();
                }
            }

            return (new[] { type }, new OpenApiSchema
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.Schema,
                    Id = type.Name,
                }
            });
        }

        private static bool IsEnumerableType(Type type, out Type elementType)
        {
            var stack = new Stack<Type>();
            stack.Push(type);

            while (stack.Any())
            {
                var curr = stack.Pop();

                if (curr.IsGenericType && curr.GetGenericTypeDefinition() == typeof(IEnumerable<>))
                {
                    elementType = curr.GenericTypeArguments[0];
                    return true;
                }

                foreach (var i in curr.GetInterfaces())
                    stack.Push(i);

                if (curr.BaseType != null)
                    stack.Push(curr.BaseType);
            }
            elementType = null;
            return false;
        }
    }

    [AttributeUsage(AttributeTargets.Interface)]
    public class SubTypesAttribute : Attribute
    {
        public Type[] Types { get; }

        public SubTypesAttribute(params Type[] types)
        {
            Types = types;
        }
    }

    class MyContractResolver : Newtonsoft.Json.Serialization.DefaultContractResolver
    {
        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            var props = type.GetProperties()
                            .Select(p => base.CreateProperty(p, memberSerialization))
                        .Union(type.GetFields()
                                   .Select(f => base.CreateProperty(f, memberSerialization)))
                        .ToList();
            props.ForEach(p => { p.Writable = true; p.Readable = true; });
            return props;
        }
    }
}
