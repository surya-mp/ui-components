/** Browser request for the application's approved subscription plan. */
export type StripeSubscribeRequest = {
  plan: string;
};

/** Response used to initialize Stripe Elements for an initial subscription payment. */
export type StripeSubscribeResponse = {
  subscriptionId: string;
  status: string;
  clientSecret: string | null;
};

/** Browser request for a short-lived Stripe Billing Portal URL. */
export type StripePortalRequest = {
  returnUrl: string;
};

export type StripePortalResponse = {
  url: string;
};

/** A small, application-owned record of a verified Stripe webhook. */
export type StripeWebhookEvent = {
  id: string;
  type: string;
};

export type StripeWebhookResponse = {
  received: true;
};

/** Optional endpoint shape for applications using the documented Stripe flow. */
export type StripeSubscriptionApi = {
  '/subscribe': {
    request: StripeSubscribeRequest;
    response: StripeSubscribeResponse;
  };
  '/portal': {
    request: StripePortalRequest;
    response: StripePortalResponse;
  };
  '/webhook': {
    event: StripeWebhookEvent;
    response: StripeWebhookResponse;
  };
};
