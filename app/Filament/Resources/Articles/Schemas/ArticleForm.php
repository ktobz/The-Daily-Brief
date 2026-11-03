<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Content')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->columnSpanFull(),
                        Textarea::make('subdeck')
                            ->rows(2)
                            ->columnSpanFull()
                            ->helperText('A short summary displayed under the headline.'),
                        Grid::make(2)->schema([
                            Select::make('category_id')
                                ->relationship('category', 'name')
                                ->searchable()
                                ->preload()
                                ->required(),
                            Select::make('user_id')
                                ->relationship('author', 'name')
                                ->searchable()
                                ->label('Author'),
                        ]),
                        Textarea::make('excerpt')
                            ->rows(2)
                            ->columnSpanFull(),
                        RichEditor::make('body')
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('Media')
                    ->schema([
                        FileUpload::make('image')
                            ->image()
                            ->disk('public')
                            ->directory('articles')
                            ->imagePreviewHeight('200')
                            ->helperText('Upload a real photo. It overrides the auto-generated placeholder.'),
                        TextInput::make('image_caption'),
                    ]),

                Section::make('Editorial settings')
                    ->schema([
                        Grid::make(3)->schema([
                            Toggle::make('is_premium')->label('Premium (paywalled)'),
                            Toggle::make('is_featured')->label('Featured'),
                            Toggle::make('is_breaking')->label('Breaking'),
                            Select::make('status')
                                ->options(['draft' => 'Draft', 'published' => 'Published'])
                                ->default('published')
                                ->required(),
                            Select::make('edition')
                                ->options(['Lagos' => 'Lagos', 'International' => 'International'])
                                ->default('Lagos'),
                            DateTimePicker::make('published_at'),
                        ]),
                        Repeater::make('co_authors')
                            ->label('Co-authors')
                            ->schema([
                                TextInput::make('name')->required(),
                                TextInput::make('role'),
                            ])
                            ->columns(2)
                            ->collapsible(),
                        KeyValue::make('key_facts')
                            ->label('Key facts')
                            ->keyLabel('Label')
                            ->valueLabel('Value'),
                        Textarea::make('data_graphic')
                            ->label('Data graphic (JSON)')
                            ->rows(6)
                            ->helperText('Optional. e.g. {"title":"…","xAxis":["2025","2026"],"series":[{"name":"…","data":[1,2]}]}')
                            ->formatStateUsing(fn ($state) => is_string($state) ? $state : json_encode($state, JSON_PRETTY_PRINT))
                            ->dehydrateStateUsing(fn ($state) => json_decode($state, true)),
                    ]),

                Section::make('Tags')
                    ->schema([
                        Select::make('tags')
                            ->relationship('tags', 'name')
                            ->multiple()
                            ->preload(),
                    ]),
            ]);
    }
}
