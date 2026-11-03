<?php

namespace App\Filament\Resources\Subscribers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SubscriberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Subscriber')
                    ->schema([
                        TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
                        Toggle::make('is_active')->label('Active')->default(true),
                    ]),
            ]);
    }
}
