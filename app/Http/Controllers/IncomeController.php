<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    public function index()
    {
        $incomes = Transaction::with('category')
            ->where('user_id', Auth::id())
            ->where('type', 'income')
            ->latest('transaction_date')
            ->get();

        return view('incomes.index', compact('incomes'));
    }

    public function create()
    {
        $categories = Category::where('user_id', Auth::id())
            ->where('type', 'income')
            ->orderBy('name')
            ->get();

        return view('incomes.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:100'],
            'transaction_date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $category = Category::where('id', $validated['category_id'])
            ->where('user_id', Auth::id())
            ->where('type', 'income')
            ->firstOrFail();

        Transaction::create([
            'user_id' => Auth::id(),
            'category_id' => $category->id,
            'type' => 'income',
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()
            ->route('incomes.index')
            ->with('success', 'Pemasukan berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        $income = Transaction::where('user_id', Auth::id())
            ->where('type', 'income')
            ->findOrFail($id);

        $income->delete();

        return redirect()
            ->route('incomes.index')
            ->with('success', 'Pemasukan berhasil dihapus.');
    }
}