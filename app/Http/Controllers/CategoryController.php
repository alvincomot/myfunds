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

    return view('categories.index', compact('categories'));
  }

  public function create()
  {
    return view('categories.create');
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => ['required', 'string', 'max:100'],
      'type' => ['required', 'in:income,expense'],
    ]);

    Category::create([
      'user_id' => Auth::id(),
      'name' => $validated['name'],
      'type' => $validated['type'],
    ]);

    return redirect()
      ->route('categories.index')
      ->with('success', 'Kategori berhasil ditambahkan.');
  }

  public function edit($id)
  {
    $category = Category::where('user_id', Auth::id())
      ->findOrFail($id);

    return view('categories.edit', compact('category'));
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

    return redirect()
      ->route('categories.index')
      ->with('success', 'Kategori berhasil diperbarui.');
  }

  public function destroy($id)
  {
    $category = Category::where('user_id', Auth::id())
      ->findOrFail($id);

    $category->delete();

    return redirect()
      ->route('categories.index')
      ->with('success', 'Kategori berhasil dihapus.');
  }
}
