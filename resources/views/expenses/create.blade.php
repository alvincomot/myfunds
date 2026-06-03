<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Add Expense
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">

                    <form action="{{ route('expenses.store') }}" method="POST">
                        @csrf

                        <div class="mb-4">
                            <label for="category_id" class="block mb-2 font-medium text-gray-700">
                                Category
                            </label>

                            <select name="category_id"
                                    id="category_id"
                                    class="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500">
                                <option value="">Select expense category</option>

                                @foreach ($categories as $category)
                                    <option value="{{ $category->id }}"
                                        {{ old('category_id') == $category->id ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>

                            @error('category_id')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label for="amount" class="block mb-2 font-medium text-gray-700">
                                Amount
                            </label>

                            <input type="number"
                                  name="amount"
                                  id="amount"
                                  value="{{ old('amount') }}"
                                  class="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                  placeholder="Example: 50000">

                            @error('amount')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label for="transaction_date" class="block mb-2 font-medium text-gray-700">
                                Date
                            </label>

                            <input type="date"
                                  name="transaction_date"
                                  id="transaction_date"
                                  value="{{ old('transaction_date', date('Y-m-d')) }}"
                                  class="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500">

                            @error('transaction_date')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label for="description" class="block mb-2 font-medium text-gray-700">
                                Description
                            </label>

                            <textarea name="description"
                                      id="description"
                                      rows="4"
                                      class="w-full border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
                                      placeholder="Example: Lunch, transportation, internet bill">{{ old('description') }}</textarea>

                            @error('description')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="flex justify-end gap-3">
                            <a href="{{ route('expenses.index') }}"
                              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Cancel
                            </a>

                            <button type="submit"
                                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Save
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>