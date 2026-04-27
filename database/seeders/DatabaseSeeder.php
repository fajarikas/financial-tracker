<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
        ]);

        $categories = [
            ['name' => 'Salary', 'type' => 'income', 'color' => '#10b981', 'icon' => 'banknote'],
            ['name' => 'Investment', 'type' => 'income', 'color' => '#059669', 'icon' => 'trending-up'],
            ['name' => 'Freelance', 'type' => 'income', 'color' => '#34d399', 'icon' => 'laptop'],

            ['name' => 'Food & Drinks', 'type' => 'expense', 'color' => '#ef4444', 'icon' => 'utensils'],
            ['name' => 'Transport', 'type' => 'expense', 'color' => '#3b82f6', 'icon' => 'car'],
            ['name' => 'Shopping', 'type' => 'expense', 'color' => '#f59e0b', 'icon' => 'shopping-bag'],
            ['name' => 'Entertainment', 'type' => 'expense', 'color' => '#8b5cf6', 'icon' => 'clapperboard'],
            ['name' => 'Bills', 'type' => 'expense', 'color' => '#6b7280', 'icon' => 'receipt'],
            ['name' => 'Health', 'type' => 'expense', 'color' => '#ec4899', 'icon' => 'heart-pulse'],
        ];

        $categoryModels = [];
        foreach ($categories as $c) {
            $categoryModels[$c['name']] = Category::create(array_merge($c, ['user_id' => $admin->id]));
        }

        $wallets = [
            ['name' => 'Bank BCA', 'type' => 'bank', 'balance' => 15750000],
            ['name' => 'Cash', 'type' => 'cash', 'balance' => 1250000],
            ['name' => 'GoPay', 'type' => 'wallet', 'balance' => 850000],
            ['name' => 'ShopeePay', 'type' => 'wallet', 'balance' => 450000],
        ];

        $walletModels = [];
        foreach ($wallets as $w) {
            $walletModels[$w['name']] = Wallet::create([
                'user_id' => $admin->id,
                'name' => $w['name'],
                'type' => $w['type'],
                'balance' => $w['balance'],
            ]);
        }

        $now = Carbon::now();

        Transaction::create([
            'user_id' => $admin->id,
            'wallet_id' => $walletModels['Bank BCA']->id,
            'category_id' => $categoryModels['Salary']->id,
            'amount' => 12000000,
            'description' => 'Monthly Salary',
            'date' => $now->copy()->startOfMonth(),
        ]);

        Transaction::create([
            'user_id' => $admin->id,
            'wallet_id' => $walletModels['Bank BCA']->id,
            'category_id' => $categoryModels['Freelance']->id,
            'amount' => 3500000,
            'description' => 'Website Project UI/UX',
            'date' => $now->copy()->subDays(5),
        ]);

        $expenses = [
            [
                'wallet' => 'Bank BCA',
                'category' => 'Bills',
                'amount' => -1500000,
                'description' => 'Rent Payment',
                'date' => $now->copy()->startOfMonth()->addDays(1),
            ],
            [
                'wallet' => 'GoPay',
                'category' => 'Food & Drinks',
                'amount' => -75000,
                'description' => 'Dinner with friends',
                'date' => $now->copy()->subDays(1),
            ],
            [
                'wallet' => 'Cash',
                'category' => 'Food & Drinks',
                'amount' => -25000,
                'description' => 'Street food snack',
                'date' => $now->copy()->subDays(2),
            ],
            [
                'wallet' => 'Bank BCA',
                'category' => 'Transport',
                'amount' => -450000,
                'description' => 'Gasoline & Parking',
                'date' => $now->copy()->subDays(3),
            ],
            [
                'wallet' => 'ShopeePay',
                'category' => 'Shopping',
                'amount' => -120000,
                'description' => 'New T-shirt',
                'date' => $now->copy()->subDays(4),
            ],
            [
                'wallet' => 'GoPay',
                'category' => 'Transport',
                'amount' => -35000,
                'description' => 'Gojek Ride',
                'date' => $now->copy(),
            ],
            [
                'wallet' => 'Bank BCA',
                'category' => 'Health',
                'amount' => -200000,
                'description' => 'Monthly Vitamins',
                'date' => $now->copy()->subDays(7),
            ],
            [
                'wallet' => 'Bank BCA',
                'category' => 'Entertainment',
                'amount' => -150000,
                'description' => 'Netflix Subscription',
                'date' => $now->copy()->subDays(10),
            ],
        ];

        foreach ($expenses as $e) {
            Transaction::create([
                'user_id' => $admin->id,
                'wallet_id' => $walletModels[$e['wallet']]->id,
                'category_id' => $categoryModels[$e['category']]->id,
                'amount' => $e['amount'],
                'description' => $e['description'],
                'date' => $e['date'],
            ]);
        }
    }
}
