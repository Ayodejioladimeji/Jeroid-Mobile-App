# Jeroid – DeFi Wallet App

A production-quality DeFi Wallet mobile app built with **React Native CLI**. Features secure passcode authentication, wallet interactions, token swaps, withdrawals, transaction lifecycle handling, and polished UX. Mock blockchain logic is used; the architecture is designed to support real integrations later.

## Features

- **Secure Passcode Authentication** – 6-digit numeric passcode with secure storage (iOS Keychain / Android Keystore), app lifecycle locking, inactivity timeout
- **Wallet Dashboard** – Truncated address with copy, balances for ETH/USDT/DAI, pull-to-refresh (TanStack Query), skeleton loaders
- **Token Swap** – Token A → Token B selector, amount + Max, estimated output & rate, validation (insufficient balance, disabled CTA with reason)
- **Withdrawal** – Token selector, amount, recipient address (0x + 40 hex validation), estimated fee, QR scanner support, confirmation with amount/recipient/fee
- **Transaction Lifecycle** – Centralized, type-safe states: Idle → Validating → Awaiting Approval → Broadcasting → Pending (tx hash) → Success / Failed (retry)
- **Transaction History** – List of past swaps & withdrawals (type, amount, status, timestamp), search functionality, detail view, persisted via AsyncStorage

## Tech Stack

- **React Native CLI**
- **TypeScript**
- **TanStack Query (React Query)** – All data fetching & caching, pull-to-refresh, invalidation
- **Redux Toolkit** – Global state: wallet, tx lifecycle, UI, history, authentication
- **React Navigation** – Native stack + bottom tabs
- **AsyncStorage** – Persist transaction history
- **react-native-keychain** – Secure passcode storage (iOS Keychain / Android Keystore)
- **crypto-js** – Passcode hashing
- **Lato** font (primary), **Deep Blue** primary brand color

## Setup

### Prerequisites

- Node.js >= 20
- React Native environment (Xcode for iOS, Android Studio for Android)
- CocoaPods (iOS): `bundle install` then `bundle exec pod install` after first clone or native dep changes

### Install & run

```bash
npm install

cd ios && bundle exec pod install && cd ..

npm start

npm run ios
```

### Lato font (optional)

The app uses a theme font family of `Lato`. If Lato is not linked, the theme falls back to the system font. To add Lato:

1. Add Lato font files (e.g. `.ttf`) under `src/assets/fonts/`.
2. Link assets via `react-native.config.js`:

   ```js
   module.exports = {
     project: { ios: {}, android: {} },
     assets: ['./src/assets/fonts/'],
   };
   ```

3. Run `npx react-native-asset`.

## Architecture

### Folder Structure

```
src/
  api/          # Data fetching & persistence (balances, swap, withdrawal, history)
  store/        # Redux Toolkit slices (wallet, txLifecycle, ui, history, auth)
  hooks/        # Reusable hooks (useBalances, useSwapQuote, useWithdrawalFee, useHistory, useAppDispatch/Selector)
  components/   # Reusable UI components
    - Button.tsx
    - Card.tsx
    - Input.tsx
    - Skeleton.tsx (BalanceRowSkeleton, DashboardSkeleton)
    - TokenSelector.tsx
    - TokenPickerModal.tsx
    - TxStatusBadge.tsx
    - AddressWithCopy.tsx
    - ErrorWithRetry.tsx
    - AuthGate.tsx
    - PasscodeDots.tsx
    - Keypad.tsx
    - KeypadButton.tsx
    - DashboardTopBar.tsx
    - ActionItem.tsx
    - DetailRow.tsx
    - ConfirmationRow.tsx
    - HistoryItem.tsx
  screens/      # Screen-level components
    - DashboardScreen.tsx
    - SwapScreen.tsx
    - WithdrawScreen.tsx
    - TxConfirmationScreen.tsx
    - TxStatusScreen.tsx
    - HistoryScreen.tsx
    - HistoryDetailScreen.tsx
    - QRScannerScreen.tsx
  theme/        # Global colors, spacing, typography
  types/        # Shared TypeScript types and navigation param lists
  navigation/   # Root navigator (stack + tabs)
  utils/        # Utility functions
    - secureStorage.ts (passcode management)
    - validation.ts (address validation)
    - formatting.ts (hash truncation, ID generation)
```

### Component Architecture

All components are separated into individual files for better maintainability and reusability:

- **Auth Components**: `AuthGate`, `PasscodeDots`, `Keypad`, `KeypadButton` – Authentication UI
- **Dashboard Components**: `DashboardTopBar`, `ActionItem` – Dashboard-specific UI
- **Transaction Components**: `DetailRow`, `ConfirmationRow`, `HistoryItem` – Transaction-related UI
- **Shared Components**: `Button`, `Card`, `Input`, `Skeleton`, `TokenSelector`, `TokenPickerModal`, `TxStatusBadge`, `AddressWithCopy`, `ErrorWithRetry` – Reusable across screens

### Utility Functions

- **secureStorage.ts**: Passcode hashing, secure storage operations (Keychain/Keystore)
- **validation.ts**: Ethereum address validation
- **formatting.ts**: Hash truncation, ID generation

### Data Flow

- **TanStack Query** – Server-like data: balances, swap quote, withdrawal fee, persisted history (load/save via API layer). Pull-to-refresh and invalidation keep data fresh.
- **Redux** – Client state: wallet address/connection, tx lifecycle (validating → … → success/failed), UI modals, in-memory history list, authentication state (isUnlocked, passcodeSet, failedAttempts, lastUnlockedAt).
- **API layer** – All reads/writes go through `src/api/`. Mock implementations can be swapped for real RPC/SDK calls without changing screens.

### Authentication Flow

- **App Launch**: `AuthGate` component checks if passcode is set
- **First Launch**: User creates and confirms 6-digit passcode (hashed and stored securely)
- **Subsequent Launches**: User enters passcode to unlock app
- **App Lifecycle**: App locks automatically when:
  - App goes to background
  - Inactivity timeout expires (5 minutes)
- **Security**: Passcode is hashed using SHA256 before storage, stored in iOS Keychain / Android Keystore

### Transaction Lifecycle

- Handled in **Redux** (`txLifecycleSlice`): status, type, txHash, error, meta.
- **TxConfirmationScreen** drives the flow: set validating → awaiting approval → broadcasting → execute (swap/withdrawal API) → set pending/success or failed → persist record (API + Redux) → invalidate history query → navigate to **TxStatusScreen**.
- **TxStatusScreen** shows status badge, amount, tx hash (copy), error + retry when failed. Balance refresh is triggered via TanStack Query invalidation on success.

### Key Trade-offs

1. **Mock vs real chain** – Balances, swap, and withdrawal are mocked in `api/`. Replacing them with real providers (e.g. ethers/viem + DEX/backend) only requires changing the API layer; store and screens stay the same.
2. **History persistence** – History is stored in AsyncStorage and also kept in Redux when adding new txs. The History screen reads via TanStack Query (`loadHistory()`); after each new tx we append to AsyncStorage and invalidate the history query so the list stays in sync.
3. **Navigation** – Stack holds: MainTabs (Dashboard, History), Swap, Withdraw, TxConfirmation, TxStatus, HistoryDetail, QRScanner. No deep linking in this version; can be added later.
4. **Font** – Lato is the designated font; fallback to system font keeps the app runnable without extra asset setup.
5. **Component Separation** – All components are in separate files for better maintainability, testability, and reusability.

## UX

- Secure passcode authentication gate on app launch
- Skeleton loaders on dashboard and history while fetching
- Disabled primary CTAs with explicit reasons (e.g. "Insufficient balance", "Enter amount")
- Toasts for copy actions; modals/bottom sheet for token picker and confirmation
- Light-mode-friendly palette (Deep Blue primary, light surfaces)
- Centralized theme: no inline colors; use `theme.colors`, `theme.spacing`, `theme.typography`
- Safe area insets applied across all screens for proper spacing
- Consistent padding and spacing throughout the app

## Extending for Real Blockchain

1. **API layer** – Replace `api/balances.ts`, `api/swap.ts`, `api/withdrawal.ts` with real RPC/SDK calls (e.g. ethers, viem, or your backend).
2. **Wallet** – Replace mock address in `walletSlice` with a real wallet (e.g. WalletConnect, MetaMask SDK, or embedded signer).
3. **Tx lifecycle** – Keep the same Redux flow; plug in real tx submission and confirmation (e.g. wait for receipt, then set success/failed).
4. **History** – Optionally sync with chain indexer or backend and still persist locally for offline view.

## Scripts

- `npm start` – Start Metro bundler
- `npm run ios` – Run iOS app
- `npm run android` – Run Android app
- `npm run lint` – Run ESLint
- `npm test` – Run Jest tests

## License

Private. See repo for details.
