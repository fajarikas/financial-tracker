<?php

use App\Models\User;
use App\Models\Wallet;
use App\Models\Category;
use App\Models\Transaction;

test('authenticated users can create a transaction and amount sign is automatic', function () {
    $user = User::factory()->create();
    $wallet = Wallet::create(['user_id' => $user->id, 'name' => 'Bank', 'type' => 'bank', 'balance' => 1000]);
    $category = Category::create(['user_id' => $user->id, 'name' => 'Food', 'type' => 'expense']);

    $response = $this->actingAs($user)->post(route('transactions.store'), [
        'wallet_id' => $wallet->id,
        'category_id' => $category->id,
        'amount' => 200,
        'description' => 'Lunch',
        'date' => now()->toDateString(),
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('transactions', ['amount' => -200]);
    $this->assertEquals(800, $wallet->fresh()->balance);
});

test('authenticated users can update a transaction and wallet balance adjusts', function () {
    $user = User::factory()->create();
    $wallet = Wallet::create(['user_id' => $user->id, 'name' => 'Bank', 'type' => 'bank', 'balance' => 800]);
    $category = Category::create(['user_id' => $user->id, 'name' => 'Food', 'type' => 'expense']);
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'wallet_id' => $wallet->id,
        'category_id' => $category->id,
        'amount' => -200,
        'date' => now()
    ]);

    $response = $this->actingAs($user)->put(route('transactions.update', $transaction->id), [
        'wallet_id' => $wallet->id,
        'category_id' => $category->id,
        'amount' => -300,
        'description' => 'Updated Lunch',
        'date' => now()->toDateString(),
    ]);

    $response->assertRedirect();
    $this->assertEquals(700, $wallet->fresh()->balance);
});

test('authenticated users can delete a transaction and wallet balance reverts', function () {
    $user = User::factory()->create();
    $wallet = Wallet::create(['user_id' => $user->id, 'name' => 'Bank', 'type' => 'bank', 'balance' => 700]);
    $category = Category::create(['user_id' => $user->id, 'name' => 'Food', 'type' => 'expense']);
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'wallet_id' => $wallet->id,
        'category_id' => $category->id,
        'amount' => -300,
        'date' => now()
    ]);

    $response = $this->actingAs($user)->delete(route('transactions.destroy', $transaction->id));

    $response->assertRedirect();
    $this->assertEquals(1000, $wallet->fresh()->balance);
});
