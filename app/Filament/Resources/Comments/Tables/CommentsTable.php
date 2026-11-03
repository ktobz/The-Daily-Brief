<?php

namespace App\Filament\Resources\Comments\Tables;

use App\Models\Comment;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CommentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('author_name')->searchable()->weight('semibold'),
                TextColumn::make('body')->limit(60)->searchable(),
                TextColumn::make('article.title')->label('Article')->limit(40),
                TextColumn::make('status')->badge()->color(fn (string $state): string => match ($state) {
                    'approved' => 'success',
                    'pending' => 'warning',
                    'spam' => 'danger',
                    default => 'gray',
                }),
                TextColumn::make('reactions')->numeric()->toggleable(),
                TextColumn::make('created_at')->dateTime('M j, Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options(['approved' => 'Approved', 'pending' => 'Pending', 'spam' => 'Spam']),
            ])
            ->recordActions([
                Action::make('approve')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (Comment $record) => $record->status !== 'approved')
                    ->action(fn (Comment $record) => $record->update(['status' => 'approved'])),
                Action::make('spam')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->action(fn (Comment $record) => $record->update(['status' => 'spam'])),
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
