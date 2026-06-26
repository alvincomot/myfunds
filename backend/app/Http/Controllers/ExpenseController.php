<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Transaction::with('category')
            ->where('user_id', Auth::id())
            ->where('type', 'expense')
            ->latest('transaction_date')
            ->get();

        return response()->json($expenses);
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
            ->where('type', 'expense')
            ->firstOrFail();

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($transaction, 201);
    }

    public function show($id)
    {
        $expense = Transaction::with('category')
            ->where('user_id', Auth::id())
            ->where('type', 'expense')
            ->findOrFail($id);
            
        return response()->json($expense);
    }

    public function update(Request $request, $id)
    {
        $expense = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->findOrFail($id);

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:100'],
            'transaction_date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $category = Category::where('id', $validated['category_id'])
            ->where('user_id', Auth::id())
            ->where('type', 'expense')
            ->firstOrFail();

        $expense->update([
            'category_id' => $category->id,
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($expense);
    }

    public function destroy($id)
    {
        $expense = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->findOrFail($id);

        $expense->delete();

        return response()->json(['message' => 'Pengeluaran berhasil dihapus.']);
    }
}