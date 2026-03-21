---
title: "How to Integrate Stripe M2 Reader in a React Native POS App — Complete Guide"
publishedDate: 2026-03-21
draft: false
description: "Learn how to build a full-featured point-of-sale system with Stripe Terminal M2 reader integration in React Native. Covers Bluetooth reader discovery, payment collection, split payments, refunds, and error handling with real production code patterns."
keywords: "Stripe M2 reader, React Native POS, Stripe Terminal SDK, mobile point of sale, card present payments, Bluetooth card reader, React Native payment integration, Stripe Terminal React Native, POS app development, in-person payments"
author: "Kliotech"
date: "2026-03-21"
popularTags: React Native, Tailwind CSS, Stripe M2
---

# How to Integrate Stripe M2 Reader in a React Native POS App

Building a point-of-sale (POS) system that accepts in-person card payments is one of the most rewarding — and challenging — things you can do with React Native. After months of building **SmartPOS**, a production React Native POS app powered by the Stripe M2 card reader, we're sharing everything we learned: the architecture, the gotchas, and the patterns that actually work.

This post covers the full journey — from Bluetooth reader discovery to capturing payments to processing refunds.

---

## Why Stripe Terminal and the M2 Reader?

The [Stripe M2](https://stripe.com/terminal) is a compact, Bluetooth-connected card reader that supports tap (NFC), chip (EMV), and swipe transactions. For mobile POS apps, it's an excellent choice because:

- **No dongle or headphone jack needed** — it connects via Bluetooth
- **Works offline-first** — queues transactions when connectivity drops
- **Supports contactless (NFC)** — fast tap-to-pay for Apple Pay, Google Pay, and contactless cards
- **Stripe's SDK handles PCI compliance** — you never touch raw card data
- **Simulated mode for development** — test without physical hardware

We use the [`@stripe/stripe-terminal-react-native`](https://github.com/stripe/stripe-terminal-react-native) SDK (beta) to interface with the reader from our React Native app.

---

## Architecture Overview

Our POS app follows a clean, context-driven architecture:

```
App
 └── AuthProvider           — Login & session management
      └── OrderSessionProvider  — Sales person, cash drawer, customer
           └── TerminalProvider     — Stripe M2 reader state
                └── CartProvider        — Products, quantities, pricing
                     └── POSScreen      — Main interface
```

We use **three separate API layers**, each backed by an Axios instance:

| API Layer   | Purpose                                      |
|-------------|----------------------------------------------|
| **POS API** | Products, customers, orders, invoices         |
| **SF API**  | Customer search, card-on-file storage         |
| **Node API**| Stripe Terminal (connection tokens, payment intents, capture) |

The Node backend acts as a thin proxy to the Stripe API, handling server-side operations like creating payment intents and capturing payments — things that must never happen on the client.

---

## Step 1: Setting Up the Stripe Terminal Provider

The first thing you need is a **connection token**. Stripe Terminal requires a fresh token from your backend each time the SDK initializes or reconnects.

```typescript
// TerminalProvider.tsx
import { StripeTerminalProvider } from '@stripe/stripe-terminal-react-native';

const fetchConnectionToken = async (): Promise<string> => {
  const response = await nodeAxiosInstance.get('/api/v1/stripe/connection-token');
  return response.data.secret;
};

export const TerminalProvider = ({ children }) => (
  <StripeTerminalProvider
    logLevel="verbose"
    tokenProvider={fetchConnectionToken}
  >
    <TerminalContextProvider>
      {children}
    </TerminalContextProvider>
  </StripeTerminalProvider>
);
```

> **Key takeaway:** The `tokenProvider` is called automatically by the SDK whenever it needs a new token. You don't manage token lifecycle manually.

---

## Step 2: Discovering and Connecting to the M2 Reader

Reader discovery uses Bluetooth scanning. The SDK fires callbacks as readers are found nearby.

```typescript
// useReaderConnection.ts
const { discoverReaders, connectBluetoothReader } = useStripeTerminal({
  onUpdateDiscoveredReaders: (readers) => {
    setDiscoveredReaders(readers);
  },
  onDidChangeConnectionStatus: (status) => {
    // 'connected' | 'connecting' | 'not_connected'
    setConnectionStatus(status);
  },
});

const startDiscovery = async () => {
  await discoverReaders({
    discoveryMethod: 'bluetoothScan',
    simulated: Config.STRIPE_SIMULATED_MODE === 'true',
  });
};

const connectToReader = async (reader: Reader.Type) => {
  // Critical: 300ms delay between cancel and connect
  await cancelDiscovering();
  await new Promise(resolve => setTimeout(resolve, 300));

  const result = await connectBluetoothReader({
    reader,
    locationId: reader.locationId,
  });
  return result;
};
```

### Gotchas We Discovered

1. **The 300ms delay is mandatory.** If you call `connectBluetoothReader` immediately after `cancelDiscovering`, the native SDK deadlocks. This isn't documented — we learned it the hard way.

2. **Battery monitoring matters.** We block connections when the reader battery is below 10% and warn at 20%. A dead reader mid-transaction is a terrible user experience.

3. **Firmware updates happen automatically** when connecting. The SDK provides progress callbacks — show them to the user or they'll think the app is frozen.

4. **Ghost connections can occur.** Sometimes the SDK reports `connected` but the reader isn't actually responsive. We implemented health checks every 5 minutes that log battery level and reader status.

---

## Step 3: The Payment Flow — From Cart to Capture

This is the core of any POS system. Our payment pipeline has **six distinct steps**:

```
Create Intent → Retrieve → Collect → Confirm → Capture → Done
   (server)      (SDK)      (SDK)     (SDK)    (server)
```

### 3.1 — Creating a Payment Intent (Server-Side)

```typescript
// paymentIntentService.ts
const createPaymentIntent = async (amountInCents: number) => {
  const response = await nodeAxiosInstance.post('/api/v1/stripe/payment-intent', {
    amount: amountInCents,
    currency: 'usd',
    metadata: { orderId, storeId, cashierId },
  });
  return response.data; // { paymentIntentId, clientSecret }
};
```

> Always send amounts in **cents**. `$25.99` becomes `2599`. This avoids floating-point issues that will haunt you at scale.

### 3.2 — Collecting the Payment Method

This is where the M2 reader lights up and waits for a card:

```typescript
// usePaymentCollection.ts
const collectPayment = async (amountInDollars: number) => {
  setStatus('creating_intent');

  // Step 1: Create intent on server
  const amountInCents = dollarsToCents(amountInDollars);
  const { clientSecret } = await createPaymentIntent(amountInCents);

  // Step 2: Retrieve intent via SDK
  setStatus('collecting');
  const { paymentIntent } = await retrievePaymentIntent(clientSecret);

  // Step 3: Collect payment method (reader waits for card)
  const { paymentIntent: collected } = await collectPaymentMethod({
    paymentIntent,
  });

  // Step 4: Confirm with the bank
  setStatus('processing');
  const { paymentIntent: confirmed } = await confirmPaymentIntent({
    paymentIntent: collected,
  });

  // Step 5: Capture on server
  setStatus('capturing');
  const captureResult = await capturePayment(confirmed.id);

  setStatus('succeeded');
  return {
    paymentIntentId: confirmed.id,
    status: 'succeeded',
    amount: captureResult.approvedAmount,
    last4: confirmed.charges?.[0]?.paymentMethodDetails?.cardPresent?.last4,
    brand: confirmed.charges?.[0]?.paymentMethodDetails?.cardPresent?.brand,
    receiptUrl: captureResult.receiptUrl,
  };
};
```

### 3.3 — Handling Partial Approvals

Some banks approve less than the requested amount. Your POS must handle this:

```typescript
if (confirmed.amount < requestedAmount) {
  return {
    ...result,
    isPartialApproval: true,
    amount: confirmed.amount,
    requestedAmount: requestedAmount,
  };
}
```

When a partial approval occurs, the cashier needs to collect the remaining balance via another method (cash, second card, etc.). This is where **split payments** come in.

---

## Step 4: Supporting Multiple Payment Methods

A real POS can't only take card payments. Our system supports:

| Method          | How It Works                                      |
|-----------------|---------------------------------------------------|
| **Terminal**    | Stripe M2 reader (card present)                   |
| **Credit Card** | Card on file (saved customer cards)               |
| **CC - Manual** | Manually keyed card number                        |
| **Cash**        | Cashier enters amount received                    |
| **Check**       | Record check number and amount                    |
| **House Account** | Charge to customer's store credit line          |
| **In-Store Credit** | Deduct from customer's wallet balance          |

The `PaymentModal` component lets cashiers **split a transaction** across multiple methods:

```typescript
// Example: $100 order paid with $60 in-store credit + $40 on M2 reader
payments: [
  { amount: 60.00, method: 'In-Store Credit' },
  { amount: 40.00, method: 'Terminal' },  // triggers M2 reader
]
```

Each payment entry is sent to the API individually. Only the `Terminal` method triggers the Stripe M2 reader flow.

---

## Step 5: Customer vs. Guest Checkout

Our POS supports two checkout modes:

### Customer Checkout
- Search by name, phone, or email
- Load saved credit cards, delivery preferences, and in-store credit
- Apply customer-specific delivery fees and tax exemptions
- Track order history

### Guest Checkout
- Uses a pre-configured "Guest" contact ID
- No saved cards or credit balance
- Quick checkout for walk-in customers

```typescript
const getContactId = () => {
  if (sessionState.isGuestCheckout) {
    return user.guest_contact_id;
  }
  return sessionState.customer?.id;
};
```

---

## Step 6: Processing Refunds

Refunds in a card-present POS system are nuanced. You can't simply reverse a tap — Stripe Terminal doesn't support refunds directly through the reader.

### Our Refund Flow

```
User cancels order with prior payment
        ↓
Frontend detects negative balance (refund due)
        ↓
Backend API: POST /refund-invoice-pre-order
        ↓
Server calls Stripe API: Stripe\Refund::create()
        ↓
Database updated: order → cancelled, payment → refund token
        ↓
Frontend shows success confirmation
```

### Why Card Reader Methods Are Disabled for Refunds

When the order total goes negative (refund scenario), we disable Terminal, Credit Card, and CC - Manual payment methods:

```typescript
const isRefund = total < 0;

if (isRefund) {
  // Only allow: Cash, Check, House Account, In-Store Credit
  disabledMethods = ['Credit Card', 'CC - Manual', 'Terminal'];
}
```

This is because Stripe processes refunds server-side via the original payment intent — not through the physical reader. The reader is only for **collecting** payments, not returning them.

---

## Error Handling: What Will Go Wrong

Card-present payments fail in creative ways. We built a comprehensive error categorization system:

```typescript
const categoriseM2Error = (error: StripeError): M2ErrorInfo => {
  // Map SDK error codes to user-friendly messages
  return {
    userMessage: "Card was removed too quickly",
    suggestion: "Please insert or tap the card again and wait for the prompt",
    retryable: true,
  };
};
```

### Common Failure Scenarios

| Error | User Message | Retryable? |
|-------|-------------|------------|
| Card removed early | "Keep card on reader until prompted" | Yes |
| Card declined | "Card was declined by the bank" | Yes (different card) |
| Insufficient funds | "Insufficient funds" | Yes (different card) |
| Reader disconnected | "Reader lost connection" | Yes (reconnect) |
| Bluetooth error | "Bluetooth connection failed" | Yes |
| Firmware updating | "Reader is updating, please wait" | No (wait) |
| Network timeout | "Connection timed out" | Yes |

### Timeout Configuration

```typescript
const PAYMENT_COLLECTION_TIMEOUT_MS = 90_000;  // 1.5 min for card tap/insert
const DISCOVERY_TIMEOUT_MS = 20_000;            // 20s to find readers
const HEALTH_CHECK_INTERVAL_MS = 300_000;       // 5 min battery/status check
```

---

## Development Without Hardware: Simulated Mode

You don't need a physical M2 reader to develop. The Stripe Terminal SDK supports a **simulated mode** .env:

```env
STRIPE_SIMULATED_MODE=true
```

When enabled, the SDK creates a virtual reader that automatically "reads" test cards. This is invaluable for:

- CI/CD testing
- UI development
- Onboarding new developers
- Demo environments

The simulated reader behaves identically to real hardware — same callbacks, same timing, same error scenarios.

---

## Debugging in Production

We built a hidden debug screen (activated by tapping the app logo 5 times) that shows:

- **Reader connection history** — every connect/disconnect event
- **Payment event log** — each step of every transaction
- **Battery level trend** — reader battery over time
- **Remote logging** — events sent to our backend for support team visibility

```typescript
// Remote logger sends structured events
remoteLogger.log({
  event: 'payment_collection_started',
  readerId: reader.serialNumber,
  amount: amountInCents,
  timestamp: Date.now(),
});
```

This has been invaluable for diagnosing issues in the field without needing to reproduce them locally.

---

## Key Lessons Learned

1. **Always use the manual capture flow.** Create the intent with `capture_method: 'manual'` so you can confirm the amount before charging. This prevents overcharges and gives you control over the final capture.

2. **Handle partial approvals from day one.** Prepaid cards and some debit cards will approve less than you requested. If your UI can't handle this, you'll have angry customers.

3. **Battery monitoring is not optional.** A reader dying mid-transaction corrupts the payment state. Monitor proactively and warn early.

4. **The 300ms discovery-to-connect delay is real.** The native Bluetooth stack needs time to clean up discovery before establishing a connection. Skip it and you'll get silent failures.

5. **Simulated mode is your best friend.** Use it for development, testing, and demos. Switch to real hardware only for final integration testing.

6. **Log everything remotely.** When a cashier says "it didn't work," you need to know exactly which step failed and why. Local logs are useless if you can't access the device.

7. **Keep amounts in cents until display time.** Floating-point math with dollars will introduce rounding errors. Convert to cents immediately and only format to dollars for UI display.

---

## Tech Stack Summary

| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile app |
| `@stripe/stripe-terminal-react-native` | M2 reader SDK |
| Context API | State management (auth, cart, session, terminal) |
| Axios | HTTP client (3 separate instances) |
| NativeWind (Tailwind) | Styling |
| React Navigation | Screen routing |
| Node.js Backend | Stripe API proxy (payment intents, captures) |
| CakePHP Backend | Business logic (orders, invoices, refunds) |

---

## Conclusion

Integrating the Stripe M2 reader into a React Native POS app is absolutely viable — but it requires understanding the full payment lifecycle, handling edge cases like partial approvals and Bluetooth quirks, and building robust error recovery.

The Stripe Terminal SDK does the heavy lifting for PCI compliance and card communication. Your job is to orchestrate the flow, handle failures gracefully, and give cashiers a UI that doesn't make them think twice.

If you're building something similar, start with simulated mode, nail the happy path, then layer in error handling and split payments. The M2 reader is a solid piece of hardware — your software just needs to keep up.
