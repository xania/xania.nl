interface ClientConfig {
  endpoint: string;
}

const config: ClientConfig = {
  // endpoint: "/api/mollie",
  endpoint: "/api/reverse/https://api.mollie.com",
};

export class MollieClient {
  public payments: PaymentsClient;
  constructor() {
    this.payments = new PaymentsClient();
  }
}
export class PaymentsClient {
  constructor() {}

  list(): Promise<ListResponse<PaymentResponse>> {
    return fetch(config.endpoint + "/v2/payments?limit=5", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer [Mollie:ApiKey]",
      },
    }).then((e) => e.json());
  }

  create(payment: CreatePayment): Promise<PaymentResponse> {
    return fetch(config.endpoint + "/v2/payments", {
      method: "POST",
      body: JSON.stringify(payment),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer [Mollie:ApiKey]",
      },
    }).then((e) => e.json());
  }
}

export interface ListResponse<T> {
  _embedded: T;
  _links: {}[];
}

export interface PaymentResponse {
  payments: {}[];
}

export interface CreatePayment {
  amount: {
    currency: "EUR";
    value: string;
  };
  description: string;
  redirectUrl?: string;
  webhookUrl?: string;
  // metadata: any;
}
