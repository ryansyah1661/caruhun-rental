<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::latest()
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->map(function ($u) {
                return [
                    'id' => (string) $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role ?? 'petugas',
                    'createdAt' => $u->created_at ? $u->created_at->format('d M Y') : '-',
                ];
            });

        return response()->json([
            'users' => $users,
            'total' => $users->count(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', Rule::in(['superadmin', 'admin', 'petugas'])],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'message' => 'Pengguna baru berhasil dibuat.',
            'user' => $user->only('id', 'name', 'email', 'role'),
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['superadmin', 'admin', 'petugas'])],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->role = $data['role'];

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Data pengguna berhasil diperbarui.',
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $target = User::findOrFail($id);

        if ($request->user() && (string) $request->user()->id === (string) $target->id) {
            return response()->json([
                'message' => 'Anda tidak bisa menghapus akun sendiri saat sedang login.',
            ], 422);
        }

        $target->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus.',
        ]);
    }
}