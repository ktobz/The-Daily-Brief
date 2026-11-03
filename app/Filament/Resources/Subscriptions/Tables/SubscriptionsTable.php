<?php

namespace App\Filament\Resources\Subscriptions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SubscriptionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->searchable()->weight('semibold'),
                TextColumn::make('plan.name'),
                TextColumn::make('status')->badge()->color(fn (string $state): string => match ($state) {
                    'active' => 'success',
                    'pending' => 'warning',
                    'cancelled' => 'danger',
                    'expired' => 'gray',
                    default => 'gray',
                }),
                TextColumn::make('starts_at')->dateTime('M j, Y')->toggleable(),
                TextColumn::make('ends_at')->dateTime('M j, Y')->toggleable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options(['active' => 'Active', 'pending' => 'Pending', 'cancelled' => 'Cancelled', 'expired' => 'Expired']),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
