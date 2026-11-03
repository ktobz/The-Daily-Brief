<?php

namespace App\Filament\Resources\Articles\Tables;

use App\Models\Article;
use App\Services\FirebaseService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ArticlesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->limit(60)
                    ->weight('semibold'),
                TextColumn::make('category.name')
                    ->badge()
                    ->color(fn ($state) => 'gray')
                    ->label('Category'),
                TextColumn::make('author.name')
                    ->label('Author')
                    ->toggleable(),
                IconColumn::make('is_premium')
                    ->boolean()
                    ->label('Premium'),
                IconColumn::make('is_breaking')
                    ->boolean()
                    ->label('Breaking'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'published' ? 'success' : 'warning'),
                TextColumn::make('published_at')
                    ->dateTime('M j, Y H:i')
                    ->sortable(),
                TextColumn::make('views')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name'),
                SelectFilter::make('status')
                    ->options(['draft' => 'Draft', 'published' => 'Published']),
                SelectFilter::make('is_premium')
                    ->label('Premium')
                    ->options([1 => 'Yes', 0 => 'No']),
            ])
            ->recordActions([
                Action::make('push')
                    ->label('Push alert')
                    ->icon('heroicon-o-megaphone')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (Article $record) {
                        $sent = app(FirebaseService::class)->sendToTopic(
                            'breaking',
                            'Breaking: '.$record->title,
                            $record->subdeck ?? $record->title,
                            env('FRONTEND_URL', 'http://localhost:3000').'/article/'.$record->slug,
                        );

                        Notification::make()
                            ->title($sent ? 'Push notification sent' : 'Firebase is not configured')
                            ->success($sent)
                            ->send();
                    }),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
