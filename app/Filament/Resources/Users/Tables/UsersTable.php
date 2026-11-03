<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->weight('semibold'),
                TextColumn::make('email')->searchable(),
                TextColumn::make('role')->badge()->color(fn (string $state): string => match ($state) {
                    'admin' => 'danger',
                    'editor' => 'warning',
                    'writer' => 'info',
                    default => 'gray',
                }),
                IconColumn::make('is_active')->boolean()->label('Active'),
                TextColumn::make('created_at')->dateTime('M j, Y')->toggleable(),
            ])
            ->filters([
                SelectFilter::make('role')->options(['admin' => 'Admin', 'editor' => 'Editor', 'writer' => 'Writer', 'reader' => 'Reader']),
            ])
            ->recordActions([
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
