<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $wallets = Wallet::where('user_id', $user->id)->get();
        
        $totalBalance = $wallets->sum('balance');

        $income = Transaction::where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('amount', '>', 0)
            ->sum('amount');

        $expense = Transaction::where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('amount', '<', 0)
            ->sum('amount');

        $transactions = Transaction::with(['wallet', 'category'])
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $allWallets = Wallet::where('user_id', $user->id)->get();
        $allCategories = Category::where('user_id', $user->id)
            ->orWhereNull('user_id')
            ->get();

        return Inertia::render('dashboard', [
            'summary' => [
                'total_balance' => (float) $totalBalance,
                'this_month_income' => (float) $income,
                'this_month_expense' => (float) abs($expense),
            ],
            'wallets' => $allWallets,
            'categories' => $allCategories,
            'transactions' => $transactions,
        ]);
    }
}
