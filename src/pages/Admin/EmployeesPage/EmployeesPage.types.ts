export interface DictionaryItem {
  id: string | number;
  name: string;
}

export interface PointTransaction {
  id: number;
  user_id: number;
  amount: number;
  action_type: "added" | "removed";
  reason: string;
  created_at: string;
}