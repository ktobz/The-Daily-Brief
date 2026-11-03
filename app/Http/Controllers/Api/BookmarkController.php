<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Bookmark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $articles = $request->user()
            ->bookmarks()
            ->with('article.category')
            ->latest()
            ->get()
            ->map(fn ($b) => $b->article);

        return response()->json(['data' => ArticleResource::collection($articles)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['article_id' => ['required', 'integer', 'exists:articles,id']]);

        Bookmark::firstOrCreate([
            'user_id' => $request->user()->id,
            'article_id' => $data['article_id'],
        ]);

        return response()->json(['bookmarked' => true], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate(['article_id' => ['required', 'integer', 'exists:articles,id']]);

        Bookmark::where('user_id', $request->user()->id)
            ->where('article_id', $data['article_id'])
            ->delete();

        return response()->json(['bookmarked' => false]);
    }

    public function status(Request $request): JsonResponse
    {
        $ids = $request->user()->bookmarks()->pluck('article_id');

        return response()->json(['article_ids' => $ids]);
    }
}
