<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Financial Statistics
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500">Total Income</p>
                    <h3 class="mt-2 text-2xl font-bold text-green-600">
                        Rp {{ number_format($totalIncome, 0, ',', '.') }}
                    </h3>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500">Total Expense</p>
                    <h3 class="mt-2 text-2xl font-bold text-red-600">
                        Rp {{ number_format($totalExpense, 0, ',', '.') }}
                    </h3>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500">Current Balance</p>
                    <h3 class="mt-2 text-2xl font-bold {{ $currentBalance >= 0 ? 'text-blue-600' : 'text-red-600' }}">
                        Rp {{ number_format($currentBalance, 0, ',', '.') }}
                    </h3>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500">This Month Income</p>
                    <h3 class="mt-2 text-xl font-semibold text-green-600">
                        Rp {{ number_format($monthlyIncome, 0, ',', '.') }}
                    </h3>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500">This Month Expense</p>
                    <h3 class="mt-2 text-xl font-semibold text-red-600">
                        Rp {{ number_format($monthlyExpense, 0, ',', '.') }}
                    </h3>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500">Monthly Balance</p>
                    <h3 class="mt-2 text-xl font-semibold {{ $monthlyBalance >= 0 ? 'text-blue-600' : 'text-red-600' }}">
                        Rp {{ number_format($monthlyBalance, 0, ',', '.') }}
                    </h3>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="mb-4 text-lg font-semibold text-gray-800">
                        Recent Transactions
                    </h3>

                    <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
                        @forelse ($recentTransactions as $transaction)
                            <div class="flex justify-between border-b pb-3">
                                <div>
                                    <p class="font-medium text-gray-800">
                                        {{ $transaction->category->name }}
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        {{ $transaction->transaction_date->format('d M Y') }}
                                        ·
                                        {{ $transaction->description ?? 'No description' }}
                                    </p>
                                </div>

                                <p class="font-semibold {{ $transaction->type === 'income' ? 'text-green-600' : 'text-red-600' }}">
                                    {{ $transaction->type === 'income' ? '+' : '-' }}
                                    Rp {{ number_format($transaction->amount, 0, ',', '.') }}
                                </p>
                            </div>
                        @empty
                            <p class="text-gray-500">
                                No transactions yet.
                            </p>
                        @endforelse
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="mb-4 text-lg font-semibold text-gray-800">
                        Expense by Category This Month
                    </h3>

                    <div class="space-y-4">
                        @forelse ($expenseByCategory as $item)
                            <div>
                                <div class="flex justify-between mb-1">
                                    <p class="text-gray-700">
                                        {{ $item->category->name }}
                                    </p>
                                    <p class="font-semibold text-red-600">
                                        Rp {{ number_format($item->total, 0, ',', '.') }}
                                    </p>
                                </div>

                                @php
                                    $percentage = $monthlyExpense > 0
                                        ? ($item->total / $monthlyExpense) * 100
                                        : 0;
                                @endphp

                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-red-500 h-2 rounded-full"
                                        style="width: {{ $percentage }}%">
                                    </div>
                                </div>
                            </div>
                        @empty
                            <p class="text-gray-500">
                                No expense data this month.
                            </p>
                        @endforelse
                    </div>
                </div>
            </div>

        </div>
    </div>
</x-app-layout>