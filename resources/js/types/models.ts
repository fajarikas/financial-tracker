export interface Wallet {
    id: number;
    user_id: number;
    name: string;
    type: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    color?: string;
    icon?: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    wallet_id: number;
    category_id: number;
    amount: string | number;
    description: string;
    date: string;
    created_at: string;
    updated_at: string;
    wallet?: Wallet;
    category?: Category;
}

export interface DashboardSummary {
    total_balance: number;
    this_month_income: number;
    this_month_expense: number;
}
