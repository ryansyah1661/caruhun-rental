<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminContentController extends Controller
{
    // POST /api/admin/pages/{slug}/{section} (Mendukung teks + upload gambar)
    public function upsertSection(Request $request, string $slug, string $section)
    {
        $validated = $request->validate([
            'badge' => 'nullable|string|max:120',
            'title' => 'nullable|string|max:255',
            'title_highlight' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'extra_items' => 'nullable|string', // JSON string jika dikirim via FormData
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        $record = PageContent::firstOrNew([
            'page_slug' => $slug,
            'section_key' => $section,
        ]);

        $record->badge = $validated['badge'] ?? $record->badge;
        $record->title = $validated['title'] ?? $record->title;
        $record->title_highlight = $validated['title_highlight'] ?? $record->title_highlight;
        $record->description = $validated['description'] ?? $record->description;

        if (!empty($validated['extra_items'])) {
            $decoded = json_decode($validated['extra_items'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $record->extra_items = $decoded;
            }
        }

        if ($request->hasFile('image')) {
            if ($record->image_path && !str_starts_with($record->image_path, 'http')) {
                Storage::disk('public')->delete($record->image_path);
            }
            $record->image_path = $request->file('image')->store('page-contents', 'public');
        }

        $record->save();

        return response()->json([
            'message' => 'Konten halaman berhasil diperbarui.',
            'data' => $record,
        ]);
    }
}