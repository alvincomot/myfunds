<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Transaction;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        $totalUsers = User::count();
        $totalTransactions = Transaction::count();
        
        $totalIncomes = Transaction::whereHas('category', function ($query) {
            $query->where('type', 'income');
        })->sum('amount');
        
        $totalExpenses = Transaction::whereHas('category', function ($query) {
            $query->where('type', 'expense');
        })->sum('amount');

        $recentUsers = User::orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'total_users' => $totalUsers,
            'total_transactions' => $totalTransactions,
            'total_incomes' => $totalIncomes,
            'total_expenses' => $totalExpenses,
            'recent_users' => $recentUsers
        ]);
    }
}
