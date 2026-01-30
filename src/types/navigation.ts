import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TransactionRecord } from './index';

export type RootStackParamList = {
  MainTabs: undefined;
  Swap: undefined;
  Withdraw: { scannedAddress?: string };
  TxConfirmation: { type: 'swap' | 'withdrawal'; payload: TxConfirmationPayload };
  TxStatus: { record: TransactionRecord };
  HistoryDetail: { record: TransactionRecord };
  QRScanner: { returnScreen: 'Withdraw' };
};

export type MainTabParamList = {
  Dashboard: undefined;
  History: undefined;
};

export type TxConfirmationPayload =
  | { fromToken: string; toToken: string; amountIn: string; amountOut: string; rate: string; fromBalance?: string; toBalance?: string }
  | { token: string; amount: string; recipient: string; fee: string; currentBalance?: string };

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
