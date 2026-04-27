<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return RedirectResponse
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return RedirectResponse
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            \Log::info('Google User Retrieved:', ['email' => $googleUser->email]);

            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            } else {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => null,
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user);

            return redirect()->intended('/dashboard');
        } catch (Exception $e) {
            \Log::error('Google Auth Error: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return redirect('/login')->with('error', 'Google authentication failed: ' . $e->getMessage());
        }
    }
}
