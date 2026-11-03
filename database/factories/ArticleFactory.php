<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    protected array $titles = [
        'Markets rally as investors weigh new fiscal policy signals',
        'Governors meet in Abuja to coordinate security response',
        'Universities announce revised academic calendar for new session',
        'Central bank holds rates steady, cites easing inflation',
        'Railway expansion reaches new state as commuters embrace service',
        'Health workers launch nationwide vaccination campaign',
        'Manufacturers push for lower energy costs at industry summit',
        'Court rules on landmark contract dispute between states',
        'Ports authority reports record cargo throughput this quarter',
        'Youths call for greater digital inclusion in governance',
        'Farmers seek better access to credit and fertiliser',
        'Cities prepare for expanded public transport networks',
        'Tech hubs expand beyond Lagos as talent spreads nationwide',
        'Maritime agency tightens rules on unregistered vessels',
        'Women entrepreneurs gather for annual trade conference',
    ];

    protected array $subdecks = [
        'Stakeholders say the move will reshape expectations across the sector in the months ahead.',
        'Officials described the development as a significant step for policy and investment.',
        'Analysts expect the decision to have a broad impact on households and businesses alike.',
        'The initiative aims to close long-standing gaps and improve outcomes nationwide.',
        'Leaders called for closer coordination as the country pursues its reform agenda.',
        'Industry groups welcomed the announcement and urged swift implementation.',
        'The latest figures point to steady progress, though challenges remain.',
        'Regulators promised clearer rules to protect consumers and encourage innovation.',
    ];

    protected array $paragraphs = [
        'The announcement was made on Friday following weeks of consultations with stakeholders across the public and private sectors.',
        'Officials said the measure is designed to address structural challenges that have held back growth and investment for years.',
        'Analysts welcomed the move but cautioned that implementation will determine whether the intended benefits are realised.',
        'Industry groups described the development as long overdue and called for a clear timeline for rollout.',
        'The government reiterated its commitment to creating a more predictable environment for businesses and investors.',
        'Community leaders said the initiative would make a tangible difference if properly funded and sustained.',
        'Experts noted that progress in the sector has been uneven, with rural areas often left behind.',
        'The changes take effect immediately, with a review scheduled for the end of the quarter.',
        'Further details are expected in the coming weeks as regulators finalise supporting guidelines.',
        'Observers said the announcement signals a broader shift in the administration\'s approach to the economy.',
    ];

    public function definition(): array
    {
        $title = fake()->randomElement($this->titles);
        $subdeck = fake()->randomElement($this->subdecks);
        $paragraphs = fake()->randomElements($this->paragraphs, rand(4, 6));

        return [
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'user_id' => User::whereIn('role', ['admin', 'editor', 'writer'])->inRandomOrder()->first()?->id,
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(6)),
            'excerpt' => $subdeck,
            'subdeck' => $subdeck,
            'body' => collect($paragraphs)->map(fn ($p) => "<p>{$p}</p>")->implode("\n"),
            'image' => 'https://picsum.photos/seed/'.urlencode(Str::slug($title)).'/800/450',
            'image_caption' => 'File photo from The Daily Brief archive.',
            'status' => 'published',
            'edition' => fake()->randomElement(['Lagos', 'International']),
            'is_premium' => fake()->boolean(20),
            'is_featured' => fake()->boolean(10),
            'is_breaking' => fake()->boolean(5),
            'views' => rand(100, 50000),
            'published_at' => fake()->dateTimeBetween('-2 months', 'now'),
        ];
    }

    public function premium(): static
    {
        return $this->state(fn () => ['is_premium' => true]);
    }
}
