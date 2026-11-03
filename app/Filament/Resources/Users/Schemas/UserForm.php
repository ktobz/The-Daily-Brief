<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Profile')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')->required(),
                            TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
                            TextInput::make('username'),
                            TextInput::make('password')
                                ->password()
                                ->dehydrated(fn ($state) => filled($state))
                                ->helperText('Leave blank to keep the current password.'),
                            Select::make('role')
                                ->options(['admin' => 'Admin', 'editor' => 'Editor', 'writer' => 'Writer', 'reader' => 'Reader'])
                                ->default('reader')
                                ->required(),
                            Toggle::make('is_active')->label('Active')->default(true),
                            Textarea::make('bio')->rows(2)->columnSpanFull(),
                        ]),
                    ]),
            ]);
    }
}
