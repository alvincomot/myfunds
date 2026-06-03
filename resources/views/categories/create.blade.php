<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Add Category Transaction
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">

                    <form action="{{ route('categories.store') }}" method="POST">
                        @csrf

                        <div class="mb-4">
                            <label for="name" class="block mb-2 font-medium text-gray-700">
                                Category Name
                            </label>
                            <input type="text"
                                  name="name"
                                  id="name"
                                  value="{{ old('name') }}"
                                  class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Example: Salary, Food, Transportation  ">

                            @error('name')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label for="type" class="block mb-2 font-medium text-gray-700">
                                Category Type
                            </label>
                            <select name="type"
                                    id="type"
                                    class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="">Select category type</option>
                                <option value="income" {{ old('type') === 'income' ? 'selected' : '' }}>
                                    Income
                                </option>
                                <option value="expense" {{ old('type') === 'expense' ? 'selected' : '' }}>
                                    Expense
                                </option>
                            </select>

                            @error('type')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="flex justify-end gap-3">
                            <a href="{{ route('categories.index') }}"
                              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Cancel
                            </a>

                            <button type="submit"
                              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
