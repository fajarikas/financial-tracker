<?php

use App\Models\User;
use App\Models\Category;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated users can list their categories', function () {
    $user = User::factory()->create();
    Category::create(['user_id' => $user->id, 'name' => 'Food', 'type' => 'expense']);

    $response = $this->actingAs($user)->get(route('categories.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('categories')
        ->has('categories', 1)
    );
});

test('authenticated users can create a category', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('categories.store'), [
        'name' => 'New Category',
        'type' => 'income',
        'color' => '#00ff00',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'user_id' => $user->id,
        'name' => 'New Category',
        'type' => 'income',
    ]);
});

test('authenticated users can update their category', function () {
    $user = User::factory()->create();
    $category = Category::create(['user_id' => $user->id, 'name' => 'Old Name', 'type' => 'expense']);

    $response = $this->actingAs($user)->put(route('categories.update', $category->id), [
        'name' => 'Updated Name',
        'type' => 'expense',
        'color' => '#ff0000',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Updated Name',
    ]);
});

test('authenticated users can delete their category', function () {
    $user = User::factory()->create();
    $category = Category::create(['user_id' => $user->id, 'name' => 'Delete Me', 'type' => 'expense']);

    $response = $this->actingAs($user)->delete(route('categories.destroy', $category->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
