# RECEIPT - Project Planning

**Last Updated:** December 16, 2025
**Project Status:** 🔴 Not Started

---

## 📋 Quick Status

- **Overall Progress:** Pre-development — PRD complete, ready to begin implementation
- **Phases Complete:** 0/5
- **Current Focus:** Project setup and environment configuration
- **Blockers:** None

**Creating New Sprints:** Follow the structure defined in [SPRINT_TEMPLATE.md](./SPRINT_TEMPLATE.md)

---

## 🚀 Current Sprint

### Sprint 01: Project Foundation

**Status:** 🔴 Not Started
**Goal:** Set up development environment, project scaffolding, and basic layout structure

**This Week's Focus:**

- Initialize React project with TypeScript
- Set up TailwindCSS and animation libraries
- Create basic two-column layout (chart left, terminal right)
- Establish component folder structure

**Sprint Reference:** `.claude/sprints/sprint-01-foundation/`

---

## 📅 Development Roadmap

### Phase 1: Project Foundation & Layout

**Status:** 🔴 Not Started
**Goal:** Establish project structure and implement static layout with placeholder components

**Key Deliverables:**

- [ ] React + TypeScript project initialized
- [ ] TailwindCSS configured
- [ ] Framer Motion / GSAP installed
- [ ] Two-column responsive layout (chart | terminal)
- [ ] POS terminal SVG/CSS component (static)
- [ ] Placeholder chart area
- [ ] Basic color scheme implemented (dark theme)

**Sprint Reference:** `.claude/sprints/sprint-01-foundation/`

---

### Phase 2: POS Terminal & Receipt UI

**Status:** 🔴 Not Started
**Goal:** Build the interactive POS terminal component with receipt printing mechanics

**Key Deliverables:**

- [ ] POS terminal visual (screen, keypad, receipt slot)
- [ ] Keypad buttons with press animations
- [ ] Receipt paper component with scroll animation
- [ ] Receipt typography (monospace, thermal paper style)
- [ ] Summary receipt template
- [ ] Whale receipt template
- [ ] Itemized receipt expansion/collapse
- [ ] Paper curl/feed animation from bottom slot

**Sprint Reference:** `.claude/sprints/sprint-02-terminal-ui/`

---

### Phase 3: Chart Integration & Candle Mechanics

**Status:** 🔴 Not Started
**Goal:** Implement live candlestick chart with candle-to-receipt linking

**Key Deliverables:**

- [ ] TradingView lightweight-charts integration
- [ ] 1-minute candle display
- [ ] Live candle on POS terminal screen
- [ ] Candle fill animation (liquid-pour effect)
- [ ] Green/red color coding for buys/sells
- [ ] Hover candle → highlight receipt
- [ ] Click candle → expand receipt
- [ ] Hover receipt → highlight candle

**Sprint Reference:** `.claude/sprints/sprint-03-chart-integration/`

---

### Phase 4: Real-Time Data & WebSocket

**Status:** 🔴 Not Started
**Goal:** Connect to Pump.fun trade stream and implement real-time updates

**Key Deliverables:**

- [ ] WebSocket connection to Pump.fun / Helius / Shyft
- [ ] Trade event parsing (wallet, side, amount, timestamp)
- [ ] Real-time candle updates
- [ ] 1-minute candle close → receipt print trigger
- [ ] Whale detection (≥1 SOL) → auto-print trigger
- [ ] Trade counter per candle
- [ ] Volume calculation
- [ ] Fee breakdown computation (creator vs protocol)
- [ ] Market cap / price tracking

**Sprint Reference:** `.claude/sprints/sprint-04-realtime-data/`

---

### Phase 5: Sound Design & Polish

**Status:** 🔴 Not Started
**Goal:** Add audio feedback, final animations, and production polish

**Key Deliverables:**

- [ ] Sound effects library setup (Howler.js)
- [ ] Trade tick sound
- [ ] Receipt print sound (thermal printer chatter)
- [ ] Whale alert sound (cha-ching)
- [ ] Button press sounds
- [ ] Mute button functionality (yellow button)
- [ ] Filter buttons functionality (red = sells, green = buys)
- [ ] Terminal shake on print
- [ ] Screen flicker on trades
- [ ] Whale alert flash/pulse
- [ ] Performance optimization
- [ ] Production build & deployment

**Sprint Reference:** `.claude/sprints/sprint-05-sound-polish/`

---

## 🔧 Technical Decisions

### Stack

- **Frontend:** React + TypeScript + TailwindCSS
- **Charts:** TradingView lightweight-charts
- **Animations:** Framer Motion or GSAP
- **Audio:** Howler.js or Web Audio API
- **Data:** Pump.fun WebSocket API (or Helius/Shyft for Solana streams)
- **Hosting:** Vercel or similar

### Key Architecture Decisions

**Component Structure**

- Modular components: Chart, Terminal, Receipt, Keypad
- State management via React Context or Zustand for trade data
- WebSocket connection as singleton service
- Status: 🟡 Under Review

**Receipt Data Model**

- Each 1-minute candle generates a receipt object
- Receipt stores: OHLC, volume, trade count, fees, itemized trades array
- Receipts stored in state with candle timestamp as key
- Status: ✅ Confirmed

**Candle-Receipt Linking**

- Bidirectional highlighting via shared state
- Candle ID = receipt ID = minute timestamp
- Status: ✅ Confirmed

**Whale Threshold**

- Fixed at ≥1 SOL for MVP
- Future: dynamic based on mcap
- Status: ✅ Confirmed

---

## ⚠️ Open Issues & Decisions Needed

### Critical (Blocking Progress)

**Data Source Selection**

- Question: Which WebSocket provider to use for real-time Pump.fun trades?
- Options:
  1. Direct Pump.fun WebSocket (if available/documented)
  2. Helius WebSocket API
  3. Shyft WebSocket API
  4. Birdeye API
- Impact: Affects Phase 4 implementation, data format, and rate limits
- Status: 🔴 **MUST DECIDE**

### High Priority

**POS Terminal Visual Approach**

- Question: SVG, pure CSS, or Canvas for terminal graphic?
- Current: Leaning toward SVG for crisp scaling + CSS for animations
- Options:
  1. SVG terminal + CSS animations
  2. Pure CSS/HTML construction
  3. Canvas rendering
- Impact: Affects Phase 2 complexity and animation capabilities
- Status: 🟡 Under Investigation

### Medium Priority

**Receipt Storage Limit**

- Question: How many receipts to keep in memory before pruning?
- Impact: Performance on long-running sessions
- Status: 🟡 Defer to Phase 4

**Mobile Responsiveness**

- Question: Support mobile in MVP or defer?
- Impact: Layout complexity
- Status: 🟡 Defer — out of MVP scope per PRD

---

## 📚 Resources

### Documentation

- [PRD](./prd.md)

### External Docs

- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/gsap/)
- [Howler.js](https://howlerjs.com/)
- [Pump.fun](https://pump.fun/)
- [Helius API Docs](https://docs.helius.dev/)
- [Shyft API Docs](https://docs.shyft.to/)

---

**END OF PLANNING DOCUMENT**
