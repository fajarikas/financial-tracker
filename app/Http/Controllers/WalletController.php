<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\UpdateWalletRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('wallets', [
            'wallets' => Wallet::where('user_id', Auth::id())->latest()->get(),
        ]);
    }

    public function store(StoreWalletRequest $request): RedirectResponse
    {
        $request->user()->wallets()->create($request->validated());

        return back()->with('success', 'Wallet created successfully.');
    }

    public function update(UpdateWalletRequest $request, Wallet $wallet): RedirectResponse
    {
        $wallet->update($request->validated());

        return back()->with('success', 'Wallet updated successfully.');
    }

    public function destroy(Wallet $wallet): RedirectResponse
    {
        if ($wallet->user_id !== Auth::id()) {
            abort(403);
        }

        $wallet->delete();

        return back()->with('success', 'Wallet deleted successfully.');
    }
}
