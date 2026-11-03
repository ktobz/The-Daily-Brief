<?php

namespace App\Filament\Resources\Plans\Tables;

use App\Models\Plan;
use App\Services\FlutterwaveService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PlansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->weight('semibold'),
                TextColumn::make('formattedPrice')->label('Price'),
                TextColumn::make('interval')->badge(),
                IconColumn::make('is_active')->boolean()->label('Active'),
                TextColumn::make('flutterwave_plan_id')->label('FLW ID')->placeholder('Not synced'),
            ])
            ->recordActions([
                Action::make('sync')
                    ->label('Sync to Flutterwave')
                    ->icon('heroicon-o-arrow-path')
                    ->action(function (Plan $record) {
                        $id = app(FlutterwaveService::class)->createPlan(
                            $record->name,
                            $record->price,
                            $record->interval,
                            $record->currency,
                        );

                        if ($id) {
                            $record->update(['flutterwave_plan_id' => (string) $id]);
                            Notification::make()->title('Plan synced')->success()->send();
                        } else {
                            Notification::make()->title('Flutterwave is not configured')->danger()->send();
                        }
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
