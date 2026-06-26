<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'in:income,expense'],
        ]);

        $category = Category::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
        ]);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::where('user_id', Auth::id())
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'in:income,expense'],
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::where('user_id', Auth::id())
            ->findOrFail($id);

        $category->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus.']);
    }
}
