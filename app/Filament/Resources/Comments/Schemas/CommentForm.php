<?php

namespace App\Filament\Resources\Comments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Comment')
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('article_id')
                                ->relationship('article', 'title')
                                ->searchable()
                                ->preload()
                                ->required(),
                            Select::make('status')
                                ->options(['approved' => 'Approved', 'pending' => 'Pending', 'spam' => 'Spam'])
                                ->default('approved')
                                ->required(),
                            TextInput::make('author_name')->required(),
                            TextInput::make('author_email')->email(),
                        ]),
                        Textarea::make('body')->rows(4)->required()->columnSpanFull(),
                    ]),
            ]);
    }
}
