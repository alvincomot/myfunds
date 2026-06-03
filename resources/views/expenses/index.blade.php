<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Pengeluaran
            </h2>

            <a href="{{ route('expenses.create') }}"
               class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Tambah Pengeluaran
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
                                <th class="py-3 text-left">Tanggal</th>
                                <th class="py-3 text-left">Kategori</th>
                                <th class="py-3 text-left">Keterangan</th>
                                <th class="py-3 text-right">Jumlah</th>
                                <th class="py-3 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            @forelse ($expenses as $expense)
                                <tr class="border-b">
                                    <td class="py-3">
                                        {{ $expense->transaction_date->format('d-m-Y') }}
                                    </td>

                                    <td class="py-3">
                                        {{ $expense->category->name }}
                                    </td>

                                    <td class="py-3">
                                        {{ $expense->description ?? '-' }}
                                    </td>

                                    <td class="py-3 text-right text-red-600 font-semibold">
                                        Rp {{ number_format($expense->amount, 0, ',', '.') }}
                                    </td>

                                    <td class="py-3 text-right">
                                        <form action="{{ route('expenses.destroy', $expense->id) }}"
                                              method="POST"
                                              class="inline-block"
                                              onsubmit="return confirm('Yakin ingin menghapus pengeluaran ini?')">
                                            @csrf
                                            @method('DELETE')

                                            <button type="submit"
                                                    class="text-red-600 hover:underline">
                                                Hapus
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="py-4 text-center text-gray-500">
                                        Belum ada data pengeluaran.
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