<?php

namespace App\Filament\Resources\Transactions\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Transaction')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('reference')->disabled(),
                            Select::make('user_id')->relationship('user', 'name')->searchable()->preload(),
                            TextInput::make('amount')->numeric(),
                            TextInput::make('currency')->default('NGN'),
                            TextInput::make('status')->disabled(),
                            TextInput::make('flutterwave_ref')->label('Flutterwave reference'),
                        ]),
                    ]),
            ]);
    }
}
