import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TransactionRecord } from '../types';

const STORAGE_KEY = 'tx_history';

export async function loadHistory(): Promise<TransactionRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TransactionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHistory(transactions: TransactionRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
  }
}

export async function appendTransaction(record: TransactionRecord): Promise<void> {
  const list = await loadHistory();
  list.unshift(record);
  await saveHistory(list);
}
