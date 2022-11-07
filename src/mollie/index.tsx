import { jsxFactory } from "@xania/view";
import { MollieClient } from "./api";

const mollieClient = new MollieClient();

// https://www.mollie.com/en/v2/payments

const jsx = jsxFactory({});
export async function MollieApp() {
  // const payment = await mollieClient.payments.create({
  //   amount: {
  //     currency: "EUR",
  //     value: "10.00", // We enforce the correct number of decimals through strings
  //   },
  //   description: "Order #12345",
  //   redirectUrl: "https://webshop.example.org/order/12345/",
  //   // webhookUrl: "https://webshop.example.org/payments/webhook/",
  // });

  // console.log(payment);
  var list = await mollieClient.payments.list();

  return {
    get view() {
      return <div>hello mollie {list._embedded.payments.length}</div>;
    },
  };
}
