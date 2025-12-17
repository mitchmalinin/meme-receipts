# RECEIPT — Product Requirements Document

## Overview

RECEIPT is an interactive art piece / trading interface for a Pump.fun token. It reimagines the trading UI as a point-of-sale terminal, replacing typical chart-focused dopamine mechanics with the cold accounting aesthetic of a receipt printer.

---

## Token Details

| Field    | Value             |
| -------- | ----------------- |
| Name     | RECEIPT           |
| Ticker   | RECEIPT           |
| Platform | Pump.fun (Solana) |
| Domain   | receipt.fun       |

---

## Layout

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   ┌────────────────┐       ┌────────────────────┐       │
│   │                │       │   ┌────────────┐   │       │
│   │                │       │   │  SCREEN    │   │       │
│   │                │       │   │  (live     │   │       │
│   │     CHART      │       │   │  candle)   │   │       │
│   │   (all candles)│       │   └────────────┘   │       │
│   │                │       │   ┌─┬─┬─┐         │       │
│   │                │       │   │1│2│3│         │       │
│   │                │       │   ├─┼─┼─┤         │       │
│   │                │       │   │4│5│6│         │       │
│   │                │       │   ├─┼─┼─┤         │       │
│   │                │       │   │🔴│🟡│🟢│        │       │
│   │                │       │   └─┴─┴─┘         │       │
│   │                │       └────────┬───────────┘       │
│   │                │                │                    │
│   │                │         ═══════╧═══════            │
│   │                │         │  RECEIPT    │            │
│   │                │         │  PAPER      │            │
│   │                │         │  (scrolls   │            │
│   │                │         │   down)     │            │
│   └────────────────┘         └─────────────┘            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Left side:** Candlestick chart showing full price history

**Right side:** 2D POS terminal illustration

- **Screen:** Displays current 1-minute candle filling in real-time
- **Receipt slot (bottom):** Paper feeds out from bottom, scrolls downward
- **Keypad:** Decorative, with functional buttons:
  - 🔴 Red button = Filter to sells only
  - 🟡 Yellow button = Mute/unmute sound
  - 🟢 Green button = Filter to buys only

---

## Core Mechanics

### Real-Time Data (WebSocket)

- Connect to Pump.fun trade stream for RECEIPT token
- Every trade updates the live candle
- Green pulse/fill for buys, red for sells

### 1-Minute Candle Cycle

1. Candle begins, trades fill it in real-time
2. After 60 seconds, candle closes
3. Summary receipt prints automatically
4. Candle resets, new cycle begins
5. Closed candle adds to chart on left

### Whale Alerts

- Any trade ≥1 SOL triggers immediate auto-print
- Interrupts normal flow with special whale receipt
- Terminal flashes/pulses on whale order

### Receipt Expansion

- Click any summary receipt to expand
- Shows itemized list of every trade in that candle
- Each line: timestamp, wallet, action, amount
- Color-coded green/red per trade

### Chart ↔ Receipt Linking

| Action        | Result                                                        |
| ------------- | ------------------------------------------------------------- |
| Hover candle  | Candle highlights, corresponding receipt highlights in scroll |
| Click candle  | Receipt expands with full summary + itemize option            |
| Hover receipt | Corresponding candle highlights on chart                      |
| Click receipt | Expands to show itemized orders                               |

---

## Receipt Formats

### Summary Receipt (every 1 minute)

```
================================
         RECEIPT #001447
    14:23:00 → 14:24:00 UTC
================================
OPEN        $0.000412
HIGH        $0.000438
LOW         $0.000401
CLOSE       $0.000429
CHANGE      +4.12%

--------------------------------
VOLUME          12.4 SOL
TRANSACTIONS    47
  BUYS     31  |  8.2 SOL
  SELLS    16  |  4.2 SOL

FEES COLLECTED  0.31 SOL
  Creator       0.09 SOL
  Protocol      0.22 SOL
--------------------------------
     [ VIEW ALL ORDERS ]
================================
```

### Whale Receipt (≥1 SOL)

```
================================
  🐋 WHALE ALERT #0023 🐋
================================
TIME        14:23:47 UTC
WALLET      8hJ4...6pQ9
ACTION      BUY
AMOUNT      5.2 SOL → 2,401,882 RECEIPT
MCAP        $127,400
% SUPPLY    2.4%

FEES PAID   0.065 SOL
  Creator   0.016 SOL
  Protocol  0.049 SOL
================================
```

### Itemized View (on click expand)

```
--------------------------------
#01  14:23:02  BUY   0.8 SOL   7xK3...9fQ2
#02  14:23:03  BUY   0.3 SOL   9aB2...3kL1
#03  14:23:05  SELL  0.1 SOL   4fD8...2nM7
#04  14:23:07  BUY   0.05 SOL  8hJ4...6pQ9
...
--------------------------------
       [ COLLAPSE ]
--------------------------------
```

---

## Animations

| Element           | Animation                                                |
| ----------------- | -------------------------------------------------------- |
| Receipt print     | Paper smoothly scrolls out from bottom slot, slight curl |
| Terminal on print | Subtle shake/vibration                                   |
| POS screen        | Flickers on each trade                                   |
| Candle fill       | Liquid-pour motion, green rising / red falling           |
| Whale alert       | Terminal pulses, screen flashes                          |
| Button press      | Subtle depression feedback                               |

---

## Sound Design

| Event          | Sound                                      |
| -------------- | ------------------------------------------ |
| Trade hits     | Soft tick/blip                             |
| Receipt prints | Thermal printer chatter (dot matrix style) |
| Whale alert    | Louder print burst + register "cha-ching"  |
| Button press   | Soft mechanical click                      |

Mute button (yellow) toggles all sound.

---

## Data Requirements

### From Pump.fun / Solana

- Real-time trade stream (WebSocket)
- Per trade: wallet, side (buy/sell), SOL amount, token amount, timestamp
- Current price / market cap
- Fee breakdown (protocol vs creator)

### Computed

- 1-minute OHLC candles
- Running trade count per candle
- Volume per candle
- Whale detection (≥1 SOL)
- Creator fees earned (per receipt)

---

## Tech Stack (Suggested)

| Layer      | Technology                                                |
| ---------- | --------------------------------------------------------- |
| Frontend   | React + CSS/SVG for terminal visual                       |
| Data       | Pump.fun WebSocket API or Helius/Shyft for Solana streams |
| Charts     | TradingView lightweight-charts                            |
| Audio      | Howler.js or Web Audio API                                |
| Animations | Framer Motion or GSAP                                     |

---

## MVP Scope

### In Scope

- Single page app
- Live candlestick chart (left)
- POS terminal with live candle on screen (right)
- Receipt scroll from bottom of terminal with 1-min summaries
- Whale auto-print (≥1 SOL)
- Click to itemize receipts
- Click candle to show its receipt
- Sound effects + mute button
- Buy/sell filter buttons (red/green)

### Out of Scope (Future)

- `/the-house` page (fee explainer)
- `/void` page (biggest losses gallery)
- `/confessional` page (holder quotes)
- Mobile optimization
- Wallet connection

---

## Copy / Branding

### Taglines

- "PRICE IS WHAT YOU SEE. COST IS WHAT YOU PAY."
- "THE REGISTER NEVER STOPS."
- "EVERY TRADE GETS A RECEIPT."

### Terminal Text

- Header: "RECEIPT MACHINE"
- Footer: "COME AGAIN SOON | RECEIPT.FUN"

---

## Visual Reference

The POS terminal design should mimic a classic card payment terminal (like Ingenico/Verifone style):

- Rectangular body with rounded edges
- Small LCD screen at top (for live candle)
- Numeric keypad below screen
- Red/Yellow/Green function buttons at bottom of keypad
- Receipt slot at bottom where paper feeds out

Color palette: Dark grays/blacks for terminal body, thermal paper white/off-white for receipts, green/red for trade colors.
