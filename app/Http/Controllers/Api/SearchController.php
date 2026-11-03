<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));

        if ($q === '') {
            return response()->json(['data' => [], 'meta' => ['total' => 0]]);
        }

        $articles = Article::published()
            ->with('category')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                    ->orWhere('excerpt', 'like', "%{$q}%")
                    ->orWhere('body', 'like', "%{$q}%");
            })
            ->orderByDesc('published_at')
            ->paginate(12);

        return response()->json([
            'data' => ArticleResource::collection($articles),
            'meta' => ['current_page' => $articles->currentPage(), 'last_page' => $articles->lastPage(), 'total' => $articles->total()],
        ]);
    }
}
