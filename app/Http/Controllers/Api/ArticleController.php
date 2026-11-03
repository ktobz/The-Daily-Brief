<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(private readonly FirebaseService $firebase) {}

    public function index(Request $request): JsonResponse
    {
        $query = Article::published()->with(['category', 'author']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->input('category')));
        }

        if ($request->filled('edition')) {
            $query->where('edition', $request->input('edition'));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->boolean('breaking')) {
            $query->breaking();
        }

        $articles = $query->orderByDesc('published_at')->paginate($request->input('per_page', 12));

        return response()->json([
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $article = Article::published()
            ->with(['category', 'author', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();

        $article->increment('views');

        $related = Article::published()
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->with('category')
            ->orderByDesc('published_at')
            ->limit(4)
            ->get();

        $nextInWorld = Article::published()
            ->with('category')
            ->orderByDesc('published_at')
            ->where('id', '!=', $article->id)
            ->limit(3)
            ->get();

        return response()->json([
            'data' => new ArticleResource($article),
            'related' => ArticleResource::collection($related),
            'next_in_world' => ArticleResource::collection($nextInWorld),
        ]);
    }

    public function comments(Article $article): JsonResponse
    {
        $comments = $article->comments()
            ->where('status', 'approved')
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'body' => $c->body,
                'author_name' => $c->author_name,
                'reactions' => $c->reactions,
                'verified' => (bool) optional($c->user)->email_verified_at,
                'created_at' => optional($c->created_at)->toIso8601String(),
            ]);

        return response()->json(['data' => $comments]);
    }

    public function storeComment(Request $request, Article $article): JsonResponse
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate(['body' => ['required', 'string', 'max:2000']]);

        $user = $request->user();

        $comment = $article->comments()->create([
            'user_id' => $user->id,
            'author_name' => $user->name,
            'author_email' => $user->email,
            'body' => $data['body'],
            'status' => 'approved',
        ]);

        $this->firebase->writeComment((string) $article->id, (string) $comment->id, [
            'articleId' => (string) $article->id,
            'authorId' => (string) $user->id,
            'authorName' => $user->name,
            'authorEmail' => $user->email ?? '',
            'body' => $comment->body,
            'parentId' => null,
            'reactions' => 0,
            'verified' => (bool) $user->email_verified_at,
            'createdAt' => $comment->created_at->toIso8601String(),
        ]);

        return response()->json([
            'data' => [
                'id' => $comment->id,
                'body' => $comment->body,
                'author_name' => $comment->author_name,
                'reactions' => $comment->reactions,
                'verified' => (bool) $user->email_verified_at,
                'created_at' => $comment->created_at->toIso8601String(),
            ],
        ], 201);
    }

    public function react(Request $request, $commentId): JsonResponse
    {
        $comment = \App\Models\Comment::findOrFail($commentId);
        $comment->increment('reactions');

        $this->firebase->updateCommentReactions((string) $comment->article_id, (string) $comment->id, $comment->reactions);

        return response()->json(['reactions' => $comment->reactions]);
    }
}
