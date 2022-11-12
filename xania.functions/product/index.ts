import { AzureFunction, Context, HttpRequest } from "@azure/functions";

export default async function httpTrigger(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(GetMenucard()),
    headers: {
      "Content-type": "application/json",
    },
  };
}

function GetMenucard(): MenuCard {
  return {
    dishes: [
      {
        id: 1,
        title: "Dish 1",
        description: "desh description 1",
        price: 123,
        options: [
          multiChoice(
            "Formaat",
            option("groot"),
            option("midden"),
            option("klein")
          ),
          multiChoice(
            "Topping",
            option("kaas"),
            option("tomaat"),
            option("mozzarella")
          ),
        ],
      },
      {
        id: 2,
        title: "Dish 2",
        description: "desh description 2",
        price: 123,
      },
      {
        id: 3,
        title: "Dish 3",
        description: "desh description 3",
        price: 123,
      },
    ],
  };
}

interface MenuCard {
  dishes: Product[];
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  options?: Option[];
}

interface Option {}

function multiChoice(
  name: string,
  ...options: ProductOption[]
): MultiChoiceOption {
  return { name, options, type: "multi" };
}

function option(value: string): ProductOption {
  return { value, type: "single" };
}

interface ProductOption {
  value: string;
  type: "single";
}

interface MultiChoiceOption {
  name: string;
  options: ProductOption[];
  type: "multi";
}
