<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->transaction->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'wallet_id' => ['required', 'exists:wallets,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'amount' => ['required', 'numeric'],
            'description' => ['nullable', 'string', 'max:255'],
            'date' => ['required', 'date'],
        ];
    }
}
