<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('categories', [
            'categories' => Category::where('user_id', Auth::id())
                ->orWhereNull('user_id')
                ->latest()
                ->get(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $request->user()->categories()->create($request->validated());

        return back()->with('success', 'Category created successfully.');
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $category->update($request->validated());

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->user_id !== Auth::id()) {
            abort(403);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
