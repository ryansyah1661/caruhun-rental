<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        // Superadmin memiliki akses bypass ke seluruh route
        if ($user->role === 'superadmin') {
            return $next($request);
        }

        if (!in_array($user->role, $roles, true)) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk tindakan ini.');
        }

        return $next($request);
    }
}