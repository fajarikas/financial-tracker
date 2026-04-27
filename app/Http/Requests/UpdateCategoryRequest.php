<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Categories are currently shared/global based on my seeder, but let's make them user-specific if we want.
        // If categories are global, maybe only admin can edit? 
        // Based on my previous seeder, they don't have user_id.
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:income,expense'],
            'color' => ['nullable', 'string', 'max:7'],
            'icon' => ['nullable', 'string', 'max:255'],
        ];
    }
}
