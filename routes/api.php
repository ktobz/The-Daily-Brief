<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AudioBroadcastController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\PushController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\FlutterwaveController;
use Illuminate\Support\Facades\Route;

Route::get('/home', [HomeController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/articles/{article}/comments', [ArticleController::class, 'comments']);
Route::post('/articles/{article}/comments', [ArticleController::class, 'storeComment']);
Route::post('/comments/{comment}/react', [ArticleController::class, 'react']);
Route::get('/search', [SearchController::class, 'index']);
Route::get('/plans', [SubscriptionController::class, 'plans']);
Route::post('/newsletter', [NewsletterController::class, 'subscribe']);
Route::post('/push/register', [PushController::class, 'register']);

Route::get('/audio', [AudioBroadcastController::class, 'index']);
Route::get('/audio/feed/{token}', [AudioBroadcastController::class, 'feed']);
Route::get('/audio/{id}', [AudioBroadcastController::class, 'show']);
Route::get('/audio/{id}/stream', [AudioBroadcastController::class, 'stream']);

Route::post('/flutterwave/webhook', [FlutterwaveController::class, 'webhook'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/firebase', [AuthController::class, 'firebase']);
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/account', [SubscriptionController::class, 'account']);
    Route::post('/audio/feed/token', [AudioBroadcastController::class, 'feedToken']);
    Route::post('/subscribe/{plan}', [SubscriptionController::class, 'subscribe']);
    Route::post('/subscribe/{subscription}/cancel', [SubscriptionController::class, 'cancel']);

    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::get('/bookmarks/status', [BookmarkController::class, 'status']);
    Route::post('/bookmarks', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks', [BookmarkController::class, 'destroy']);
});
