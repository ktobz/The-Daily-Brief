<?php

namespace App\Filament\Resources\Subscriptions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SubscriptionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Subscription')
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('user_id')
                                ->relationship('user', 'name')
                                ->searchable()
                                ->preload()
                                ->required(),
                            Select::make('plan_id')
                                ->relationship('plan', 'name')
                                ->required(),
                            Select::make('status')
                                ->options(['pending' => 'Pending', 'active' => 'Active', 'cancelled' => 'Cancelled', 'expired' => 'Expired'])
                                ->default('pending')
                                ->required(),
                            TextInput::make('flutterwave_subscription_id')->label('Flutterwave subscription ID'),
                            DateTimePicker::make('starts_at'),
                            DateTimePicker::make('ends_at'),
                            DateTimePicker::make('cancelled_at'),
                        ]),
                    ]),
            ]);
    }
}
