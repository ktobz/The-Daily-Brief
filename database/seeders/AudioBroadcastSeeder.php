<?php

namespace Database\Seeders;

use App\Models\AudioBroadcast;
use Illuminate\Database\Seeder;

class AudioBroadcastSeeder extends Seeder
{
    public function run(): void
    {
        $broadcast = AudioBroadcast::create([
            'title' => 'The Geneva Accord & the Repricing of Sovereign Debt',
            'slug' => 'geneva-accord-sovereign-debt',
            'episode_number' => 1,
            'dek' => 'Inside the 48-hour negotiation that reshaped the climate framework — and the market response rippling through credit spreads across emerging economies.',
            'audio_s3_path' => null,
            'duration_seconds' => 1110,
            'waveform_peaks' => $this->waveform(100),
            'tier' => 'audio_master',
            'audio_format' => '24-Bit 96kHz Lossless FLAC',
            'is_live_wire' => false,
            'published_at' => now()->subHour(),
        ]);

        $segments = [
            [0, 34, 'Amara Okafor', 'Host', "You're listening to Dispatches & Sound. I'm Amara Okafor, and this is the morning wire."],
            [34, 96, 'Elena Rostova', 'Diplomatic Correspondent', 'By the second evening in Geneva, the plenary had effectively stalled. Three large-emitting economies refused to sign unless the compliance schedule was staggered.'],
            [96, 168, 'David K. Chen', 'Climate Editor', 'The turning point came when Nigeria and Brazil tabled a joint amendment linking ratification to access to the transition fund. That unlocked the room.'],
            [168, 244, 'Marcus Sterling', 'Markets Editor', 'Within hours, credit markets began repricing. Nigerian sovereign spreads tightened roughly eighteen basis points, and the move cascaded into Indonesia and Vietnam.'],
            [244, 320, 'Amara Okafor', 'Host', 'Marcus, help us understand why a climate accord moves sovereign credit that quickly.'],
            [320, 420, 'Marcus Sterling', 'Markets Editor', 'Because the fund is conditional. Markets read the text as a near-term fiscal backstop for emerging issuers — and that changes the default calculus almost immediately.'],
            [420, 505, 'Elena Rostova', 'Diplomatic Correspondent', 'The final hours were exhausting. Delegates worked through two nights, and the independent audit mechanism was the last item to fall.'],
            [505, 600, 'David K. Chen', 'Climate Editor', 'What was agreed is ambitious on paper. The real test is domestic ratification, and we should not underestimate how hard that will be.'],
            [600, 700, 'Marcus Sterling', 'Markets Editor', 'In Asia, the FX reaction was immediate. The ringgit and the won both strengthened as funds rotated into markets seen as early beneficiaries of the framework.'],
            [700, 780, 'Amara Okafor', 'Host', "That's the picture for now. The full transcript and executive takeaways are below, and the evening cap will carry the cross-asset wrap."],
        ];

        foreach ($segments as $i => [$start, $end, $speaker, $title, $content]) {
            $broadcast->transcripts()->create([
                'speaker_name' => $speaker,
                'speaker_title' => $title,
                'start_second' => $start,
                'end_second' => $end,
                'content' => $content,
                'is_key_quote' => in_array($speaker, ['Marcus Sterling']),
                'sequence_order' => $i,
            ]);
        }
    }

    protected function waveform(int $count): array
    {
        $peaks = [];

        for ($i = 0; $i < $count; $i++) {
            $a = abs(sin($i * 12.9898) * 43758.5453) % 1;
            $b = abs(sin(($i + 7) * 3.73) * 0.6);
            $peaks[] = (int) round((0.18 + 0.82 * ($a * 0.55 + $b * 0.45)) * 100);
        }

        return $peaks;
    }
}
