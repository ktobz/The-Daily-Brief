<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('order')->orderBy('name')
            ->get();

        return response()->json(['data' => CategoryResource::collection($categories)]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $articles = $category->articles()
            ->published()
            ->when($request->filled('edition'), fn ($q) => $q->where('edition', $request->input('edition')))
            ->with('category')
            ->orderByDesc('published_at')
            ->paginate(12);

        return response()->json([
            'category' => new CategoryResource($category),
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'total' => $articles->total(),
            ],
        ]);
    }
}
