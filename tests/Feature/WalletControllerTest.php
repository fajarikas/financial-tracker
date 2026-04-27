<?php

use App\Models\User;
use App\Models\Wallet;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated users can list their wallets', function () {
    $user = User::factory()->create();
    Wallet::create(['user_id' => $user->id, 'name' => 'My Wallet', 'type' => 'bank', 'balance' => 100]);

    $response = $this->actingAs($user)->get(route('wallets.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('wallets')
        ->has('wallets', 1)
    );
});

test('authenticated users can create a wallet', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('wallets.store'), [
        'name' => 'New Wallet',
        'type' => 'cash',
        'balance' => 500,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('wallets', [
        'user_id' => $user->id,
        'name' => 'New Wallet',
        'type' => 'cash',
        'balance' => 500,
    ]);
});

test('authenticated users can update their wallet', function () {
    $user = User::factory()->create();
    $wallet = Wallet::create(['user_id' => $user->id, 'name' => 'Old Name', 'type' => 'bank', 'balance' => 100]);

    $response = $this->actingAs($user)->put(route('wallets.update', $wallet->id), [
        'name' => 'Updated Name',
        'type' => 'bank',
        'balance' => 200,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('wallets', [
        'id' => $wallet->id,
        'name' => 'Updated Name',
        'balance' => 200,
    ]);
});

test('authenticated users can delete their wallet', function () {
    $user = User::factory()->create();
    $wallet = Wallet::create(['user_id' => $user->id, 'name' => 'Delete Me', 'type' => 'bank', 'balance' => 100]);

    $response = $this->actingAs($user)->delete(route('wallets.destroy', $wallet->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('wallets', ['id' => $wallet->id]);
});
