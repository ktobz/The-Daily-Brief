<?php

namespace App\Filament\Resources\Plans\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PlanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Plan')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')->required(),
                            TextInput::make('slug'),
                            TextInput::make('price')->numeric()->required()->prefix('NGN'),
                            Select::make('interval')
                                ->options(['monthly' => 'Monthly', 'yearly' => 'Yearly'])
                                ->default('monthly')
                                ->required(),
                            TextInput::make('currency')->default('NGN')->required(),
                            TextInput::make('order')->numeric()->default(0),
                            Toggle::make('is_active')->label('Active')->default(true),
                            Textarea::make('description')->rows(3)->columnSpanFull(),
                            KeyValue::make('features')->keyLabel('Feature')->valueLabel('Description'),
                            TextInput::make('flutterwave_plan_id')
                                ->label('Flutterwave plan ID')
                                ->disabled()
                                ->helperText('Managed automatically via the "Sync to Flutterwave" action.'),
                        ]),
                    ]),
            ]);
    }
}
