<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,user',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,user',
        ]);

        // SAFEGUARDS
        $isChangingRole = $user->role !== $request->role;
        $isAdmin = $user->role === 'admin';
        
        if ($isChangingRole && $isAdmin) {
            // Self-demotion protection
            if (auth()->id() === $user->id) {
                return response()->json(['message' => 'Aksi ditolak: Anda tidak bisa menurunkan pangkat (role) Anda sendiri.'], 403);
            }

            // Last admin standing protection
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json(['message' => 'Aksi ditolak: Sistem harus memiliki setidaknya 1 Admin.'], 403);
            }
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ]);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        if ($user->role === 'admin') {
            // Self-deletion protection
            if (auth()->id() === $user->id) {
                return response()->json(['message' => 'Aksi ditolak: Anda tidak bisa menghapus akun Anda sendiri.'], 403);
            }

            // Last admin standing protection
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json(['message' => 'Aksi ditolak: Sistem harus memiliki setidaknya 1 Admin.'], 403);
            }
        }

        $user->delete();

        return response()->json(['message' => 'Pengguna berhasil dihapus']);
    }
}
