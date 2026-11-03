<?php

namespace App\Filament\Resources\AdSlots\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AdSlotForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Ad slot')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')->required(),
                            TextInput::make('code')->required(),
                            Select::make('location')
                                ->options(['top' => 'Top', 'hero' => 'Hero', 'sidebar' => 'Sidebar', 'inline' => 'Inline', 'footer' => 'Footer'])
                                ->default('inline')
                                ->required(),
                            TextInput::make('url')->url(),
                            TextInput::make('order')->numeric()->default(0),
                            Toggle::make('is_active')->label('Active')->default(true),
                            FileUpload::make('image')->image()->directory('ads')->columnSpanFull(),
                        ]),
                    ]),
            ]);
    }
}
