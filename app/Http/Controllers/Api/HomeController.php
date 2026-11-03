<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $edition = $request->query('edition', 'Lagos');

        $applyEdition = function ($query) use ($edition) {
            return $query->where('edition', $edition);
        };

        $hero = $applyEdition(Article::published())
            ->with(['category', 'author'])
            ->orderByDesc('published_at')
            ->limit(6)
            ->get();

        $lead = $hero->shift();

        $editorsPicks = $applyEdition(Article::published())
            ->featured()
            ->with('category')
            ->orderByDesc('published_at')
            ->limit(5)
            ->get();

        $rails = Category::whereNull('parent_id')
            ->whereNotIn('slug', ['breaking-news', 'sponsored'])
            ->orderBy('order')->orderBy('name')
            ->get()
            ->map(function ($category) use ($applyEdition) {
                $articles = $applyEdition(Article::published())
                    ->where('category_id', $category->id)
                    ->with('category')
                    ->orderByDesc('published_at')
                    ->limit(6)
                    ->get();

                return [
                    'category' => [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'color' => $category->colorOrDefault(),
                    ],
                    'articles' => ArticleResource::collection($articles),
                ];
            })
            ->filter(fn ($rail) => $rail['articles']->isNotEmpty())
            ->values();

        $wire = $applyEdition(Article::published())
            ->with('category')
            ->orderByDesc('published_at')
            ->limit(15)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'category' => $a->category?->name,
                'published_at' => optional($a->published_at)->toIso8601String(),
            ]);

        return response()->json([
            'edition' => $edition,
            'lead' => $lead ? new ArticleResource($lead) : null,
            'hero' => ArticleResource::collection($hero),
            'editors_picks' => ArticleResource::collection($editorsPicks),
            'rails' => $rails,
            'wire' => $wire,
        ]);
    }
}
