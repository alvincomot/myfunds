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

        // --- Calculate Previous Month Stats for Percentage ---
        $lastMonthIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereMonth('transaction_date', now()->subMonth()->month)
            ->whereYear('transaction_date', now()->subMonth()->year)
            ->sum('amount');

        $lastMonthExpense = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', now()->subMonth()->month)
            ->whereYear('transaction_date', now()->subMonth()->year)
            ->sum('amount');
            
        $lastMonthBalance = $lastMonthIncome - $lastMonthExpense;

        // Calculate Percentages
        $incomePercentage = $lastMonthIncome > 0 ? round((($monthlyIncome - $lastMonthIncome) / $lastMonthIncome) * 100, 1) : ($monthlyIncome > 0 ? 100 : 0);
        $expensePercentage = $lastMonthExpense > 0 ? round((($monthlyExpense - $lastMonthExpense) / $lastMonthExpense) * 100, 1) : ($monthlyExpense > 0 ? 100 : 0);
        $balancePercentage = $lastMonthBalance > 0 ? round((($monthlyBalance - $lastMonthBalance) / $lastMonthBalance) * 100, 1) : ($monthlyBalance > 0 ? 100 : 0);
        // -----------------------------------------------------

        $recentTransactions = Transaction::with('category')
            ->where('user_id', $userId)
            ->latest('transaction_date')
            ->latest()
            ->take(20)
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

        return response()->json([
            'totalIncome' => (float) $totalIncome,
            'totalExpense' => (float) $totalExpense,
            'currentBalance' => (float) $currentBalance,
            'monthlyIncome' => (float) $monthlyIncome,
            'monthlyExpense' => (float) $monthlyExpense,
            'monthlyBalance' => (float) $monthlyBalance,
            'incomePercentage' => $incomePercentage,
            'expensePercentage' => $expensePercentage,
            'balancePercentage' => $balancePercentage,
            'recentTransactions' => $recentTransactions,
            'expenseByCategory' => $expenseByCategory
        ]);
    }
}