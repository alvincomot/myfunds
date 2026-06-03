<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Tambah Pemasukan
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">

                    <form action="{{ route('incomes.store') }}" method="POST">
                        @csrf

                        <div class="mb-4">
                            <label class="block mb-2 font-medium text-gray-700">
                                Kategori
                            </label>
                            <select name="category_id" class="w-full border-gray-300 rounded-lg">
                                <option value="">Pilih kategori pemasukan</option>
                                @foreach ($categories as $category)
                                    <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>

                            @error('category_id')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block mb-2 font-medium text-gray-700">
                                Jumlah
                            </label>
                            <input type="number"
                                  name="amount"
                                  value="{{ old('amount') }}"
                                  class="w-full border-gray-300 rounded-lg"
                                  placeholder="Contoh: 5000000">

                            @error('amount')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block mb-2 font-medium text-gray-700">
                                Tanggal
                            </label>
                            <input type="date"
                                  name="transaction_date"
                                  value="{{ old('transaction_date', date('Y-m-d')) }}"
                                  class="w-full border-gray-300 rounded-lg">

                            @error('transaction_date')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block mb-2 font-medium text-gray-700">
                                Keterangan
                            </label>
                            <textarea name="description"
                                      class="w-full border-gray-300 rounded-lg"
                                      placeholder="Contoh: Gaji bulan Juni">{{ old('description') }}</textarea>

                            @error('description')
                                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="flex justify-end gap-3">
                            <a href="{{ route('incomes.index') }}"
                              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Batal
                            </a>

                            <button type="submit"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Simpan
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>