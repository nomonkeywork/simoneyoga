<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageApiController extends Controller
{
    /**
     * Get all pages
     */
    public function index(): JsonResponse
    {
        try {
            $pages = Page::select('id', 'slug', 'title', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json($pages);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch pages'], 500);
        }
    }

    /**
     * Get page by slug
     */
    public function show(string $slug): JsonResponse
    {
        try {
            $page = Page::where('slug', $slug)->first();
            
            if (!$page) {
                return response()->json(['error' => 'Page not found'], 404);
            }
            
            return response()->json([
                'id' => $page->id,
                'slug' => $page->slug,
                'title' => $page->title,
                'content' => $page->content,
                'created_at' => $page->created_at,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch page'], 500);
        }
    }
}

