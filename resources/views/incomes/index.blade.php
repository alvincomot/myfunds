<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Incomes
            </h2>

            <a href="{{ route('incomes.create') }}"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Income
            </a>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            @if (session('success'))
                <div class="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    {{ session('success') }}
                </div>
            @endif

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="border-b">
                                <th class="py-3 text-left">Date</th>
                                <th class="py-3 text-left">Category</th>
                                <th class="py-3 text-left">Description</th>
                                <th class="py-3 text-right">Amount</th>
                                <th class="py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($incomes as $income)
                                <tr class="border-b">
                                    <td class="py-3">
                                        {{ $income->transaction_date->format('d-m-Y') }}
                                    </td>
                                    <td class="py-3">
                                        {{ $income->category->name }}
                                    </td>
                                    <td class="py-3">
                                        {{ $income->description ?? '-' }}
                                    </td>
                                    <td class="py-3 text-right">
                                        Rp {{ number_format($income->amount, 0, ',', '.') }}
                                    </td>
                                    <td class="py-3 text-right">
                                        <form action="{{ route('incomes.destroy', $income->id) }}"
                                              method="POST"
                                              onsubmit="return confirm('Are you sure you want to delete this income?')">
                                            @csrf
                                            @method('DELETE')

                                            <button type="submit" class="text-red-600 hover:underline">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="py-4 text-center text-gray-500">
                                        No income data available.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</x-app-layout>