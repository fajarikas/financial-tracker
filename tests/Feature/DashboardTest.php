<?php

use App\Models\User;
use App\Models\Wallet;
use App\Models\Category;
use App\Models\Transaction;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard and see summary data', function () {
    $user = User::factory()->create();

    $wallet = Wallet::create([
        'user_id' => $user->id,
        'name' => 'Test Wallet',
        'type' => 'bank',
        'balance' => 1000
    ]);

    $category = Category::create([
        'name' => 'Test Category',
        'type' => 'income'
    ]);

    Transaction::create([
        'user_id' => $user->id,
        'wallet_id' => $wallet->id,
        'category_id' => $category->id,
        'amount' => 500,
        'description' => 'Test Income',
        'date' => now()
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(
        fn(Assert $page) => $page
            ->component('dashboard')
            ->has(
                'summary',
                fn(Assert $page) => $page
                    ->where('total_balance', 1000)
                    ->where('this_month_income', 500)
                    ->where('this_month_expense', 0)
            )
            ->has('wallets', 1)
            ->has('transactions', 1)
    );
});
