<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Models\Category;

class TransactionController extends Controller
{
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $data = $request->validated();
            $category = Category::findOrFail($request->category_id);

            $amount = abs($request->amount);
            $data['amount'] = ($category->type === 'expense') ? -$amount : $amount;

            $request->user()->transactions()->create($data);

            $wallet = Wallet::findOrFail($request->wallet_id);
            $wallet->increment('balance', $data['amount']);
        });

        return back()->with('success', 'Transaction created successfully.');
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        DB::transaction(function () use ($request, $transaction) {
            $data = $request->validated();
            $category = Category::findOrFail($request->category_id);

            $amount = abs($request->amount);
            $data['amount'] = ($category->type === 'expense') ? -$amount : $amount;

            $oldWallet = Wallet::findOrFail($transaction->wallet_id);
            $oldWallet->decrement('balance', $transaction->amount);

            $transaction->update($data);

            $newWallet = Wallet::findOrFail($request->wallet_id);
            $newWallet->increment('balance', $data['amount']);
        });

        return back()->with('success', 'Transaction updated successfully.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        DB::transaction(function () use ($transaction) {
            $wallet = Wallet::findOrFail($transaction->wallet_id);
            $wallet->decrement('balance', $transaction->amount);

            $transaction->delete();
        });

        return back()->with('success', 'Transaction deleted successfully.');
    }
}
