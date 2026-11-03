<?php

namespace App\Filament\Resources\Transactions\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')->searchable()->fontFamily('mono'),
                TextColumn::make('user.name')->label('Customer'),
                TextColumn::make('amount')->numeric()->prefix('₦'),
                TextColumn::make('status')->badge()->color(fn (string $state): string => match ($state) {
                    'successful' => 'success',
                    'pending' => 'warning',
                    'failed' => 'danger',
                    default => 'gray',
                }),
                TextColumn::make('created_at')->dateTime('M j, Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options(['successful' => 'Successful', 'pending' => 'Pending', 'failed' => 'Failed']),
            ]);
    }
}
