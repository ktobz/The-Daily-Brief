<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Category')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')->required(),
                            TextInput::make('slug')->helperText('Leave blank to auto-generate.'),
                            ColorPicker::make('color'),
                            TextInput::make('order')->numeric()->default(0),
                            Select::make('parent_id')
                                ->relationship('parent', 'name')
                                ->label('Parent category')
                                ->placeholder('None')
                                ->nullable(),
                            Textarea::make('description')->rows(2)->columnSpanFull(),
                        ]),
                    ]),
            ]);
    }
}
