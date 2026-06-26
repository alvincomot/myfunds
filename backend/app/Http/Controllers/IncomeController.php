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

        return response()->json($incomes);
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

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'category_id' => $category->id,
            'type' => 'income',
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($transaction, 201);
    }

    public function show($id)
    {
        $income = Transaction::with('category')
            ->where('user_id', Auth::id())
            ->where('type', 'income')
            ->findOrFail($id);
            
        return response()->json($income);
    }

    public function update(Request $request, $id)
    {
        $income = Transaction::where('user_id', Auth::id())
            ->where('type', 'income')
            ->findOrFail($id);

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

        $income->update([
            'category_id' => $category->id,
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($income);
    }

    public function destroy($id)
    {
        $income = Transaction::where('user_id', Auth::id())
            ->where('type', 'income')
            ->findOrFail($id);

        $income->delete();

        return response()->json(['message' => 'Pemasukan berhasil dihapus.']);
    }
}