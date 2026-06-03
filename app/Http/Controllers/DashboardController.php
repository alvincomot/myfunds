<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $totalIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->sum('amount');

        $totalExpense = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->sum('amount');

        $currentBalance = $totalIncome - $totalExpense;

        $monthlyIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->sum('amount');

        $monthlyExpense = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->sum('amount');

        $monthlyBalance = $monthlyIncome - $monthlyExpense;

        $recentTransactions = Transaction::with('category')
            ->where('user_id', $userId)
            ->latest('transaction_date')
            ->latest()
            ->take(5)
            ->get();

        $expenseByCategory = Transaction::select('category_id', DB::raw('SUM(amount) as total'))
            ->with('category')
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return view('dashboard', compact(
            'totalIncome',
            'totalExpense',
            'currentBalance',
            'monthlyIncome',
            'monthlyExpense',
            'monthlyBalance',
            'recentTransactions',
            'expenseByCategory'
        ));
    }
}