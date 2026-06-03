<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Kategori Transaksi
            </h2>

            <a href="{{ route('categories.create') }}"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Tambah Kategori
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
                                <th class="py-3 text-left">Nama Kategori</th>
                                <th class="py-3 text-left">Tipe</th>
                                <th class="py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($categories as $category)
                                <tr class="border-b">
                                    <td class="py-3">
                                        {{ $category->name }}
                                    </td>
                                    <td class="py-3">
                                        @if ($category->type === 'income')
                                            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                Pemasukan
                                            </span>
                                        @else
                                            <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                                Pengeluaran
                                            </span>
                                        @endif
                                    </td>
                                    <td class="py-3 text-right">
                                        <a href="{{ route('categories.edit', $category->id) }}"
                                          class="text-blue-600 hover:underline">
                                            Edit
                                        </a>

                                        <form action="{{ route('categories.destroy', $category->id) }}"
                                              method="POST"
                                              class="inline-block ml-3"
                                              onsubmit="return confirm('Yakin ingin menghapus kategori ini?')">
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
                                    <td colspan="3" class="py-4 text-center text-gray-500">
                                        Belum ada kategori transaksi.
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
