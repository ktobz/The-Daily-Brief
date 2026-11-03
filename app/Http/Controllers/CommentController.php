<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use App\Services\FirebaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(private readonly FirebaseService $firebase) {}

    /**
     * Store a comment (mirrored to Firestore for realtime sync).
     */
    public function store(Request $request, Article $article): JsonResponse
    {
        if (! auth()->check()) {
            return response()->json(['message' => 'Please sign in to comment.'], 401);
        }

        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $user = auth()->user();

        $comment = $article->comments()->create([
            'user_id' => $user->id,
            'parent_id' => null,
            'author_name' => $user->name,
            'author_email' => $user->email,
            'body' => $data['body'],
            'status' => 'approved',
        ]);

        $this->writeToFirestore($article, $comment);

        return response()->json([
            'ok' => true,
            'comment' => $comment->only(['id', 'body', 'author_name', 'created_at']),
        ]);
    }

    /**
     * Increment reactions (likes) for a comment.
     */
    public function react(Comment $comment): JsonResponse
    {
        $comment->increment('reactions');

        $this->firebase->updateCommentReactions((string) $comment->article_id, (string) $comment->id, $comment->reactions);

        return response()->json(['ok' => true, 'reactions' => $comment->reactions]);
    }

    protected function writeToFirestore(Article $article, Comment $comment): void
    {
        $this->firebase->writeComment((string) $article->id, (string) $comment->id, [
            'articleId' => (string) $article->id,
            'authorId' => (string) ($comment->user_id ?? ''),
            'authorName' => $comment->author_name,
            'authorEmail' => $comment->author_email ?? '',
            'body' => $comment->body,
            'parentId' => null,
            'reactions' => 0,
            'verified' => (bool) ($comment->user?->email_verified_at),
            'createdAt' => $comment->created_at->toIso8601String(),
        ]);
    }
}
