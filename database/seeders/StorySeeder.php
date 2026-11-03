<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StorySeeder extends Seeder
{
    public function run(): void
    {
        $editors = User::whereIn('role', ['admin', 'editor'])->get();

        $stories = $this->stories();

        foreach ($stories as $i => $story) {
            $category = Category::where('slug', $story['category'])->first();

            if (! $category) {
                continue;
            }

            $publishedAt = now()->subHours($i * 5 + 1);

            $article = Article::create([
                'category_id' => $category->id,
                'user_id' => $story['user_id'] ?? $editors->random()->id,
                'title' => $story['title'],
                'slug' => Str::slug($story['title']),
                'excerpt' => $story['subdeck'],
                'subdeck' => $story['subdeck'],
                'co_authors' => $story['co_authors'] ?? null,
                'body' => $this->html($story['body']),
                'image' => $story['image'] ?? null,
                'image_caption' => $story['image_caption'] ?? null,
                'key_facts' => $story['key_facts'] ?? null,
                'data_graphic' => $story['data_graphic'] ?? null,
                'status' => 'published',
                'edition' => $story['edition'] ?? 'Lagos',
                'is_premium' => $story['is_premium'] ?? false,
                'is_featured' => $story['is_featured'] ?? false,
                'is_breaking' => $story['is_breaking'] ?? false,
                'views' => rand(800, 90000),
                'published_at' => $publishedAt,
            ]);

            foreach ($story['tags'] ?? [] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName, 'slug' => Str::slug($tagName)]);
                $article->tags()->syncWithoutDetaching([$tag->id]);
            }
        }
    }

    protected function html(array $paragraphs): string
    {
        return collect($paragraphs)->map(fn ($p) => "<p>{$p}</p>")->implode("\n");
    }

    protected function img(string $text): string
    {
        return 'https://picsum.photos/seed/'.urlencode(Str::slug($text)).'/800/450';
    }

    protected function stories(): array
    {
        return [
            [
                'category' => 'world',
                'title' => 'Global climate summit reaches landmark 48-hour consensus on emissions',
                'subdeck' => 'Delegates from 190 nations agreed a binding framework to accelerate mandatory reductions, ending two days of tense late-night negotiations in Geneva.',
                'co_authors' => [
                    ['name' => 'Elena Rostova', 'role' => 'Diplomatic Correspondent'],
                    ['name' => 'David K. Chen', 'role' => 'Climate Editor'],
                ],
                'key_facts' => [
                    ['label' => 'Nations in agreement', 'value' => '190 of 193'],
                    ['label' => 'Target by 2035', 'value' => '−43% emissions'],
                    ['label' => 'Climate fund pledged', 'value' => '$310bn'],
                    ['label' => 'Next review', 'value' => 'Bonn, 2027'],
                ],
                'data_graphic' => [
                    'title' => 'Trajectory of Mandatory Reductions',
                    'subtitle' => 'Projected CO2 emissions under the new framework (gigatonnes)',
                    'xAxis' => ['2025', '2027', '2029', '2031', '2033', '2035'],
                    'series' => [
                        ['name' => 'Current policy', 'data' => [36, 35, 34, 33, 31, 30]],
                        ['name' => 'New framework', 'data' => [36, 33, 29, 26, 23, 20]],
                    ],
                ],
                'edition' => 'International',
                'is_featured' => true,
                'image' => $this->img('Geneva Summit'),
                'image_caption' => 'World delegates gather in the main hall of the Geneva summit for the final vote.',
                'tags' => ['Climate', 'Diplomacy', 'Environment'],
                'body' => [
                    'After 48 hours of round-the-clock negotiation, delegates at the Geneva climate summit voted overwhelmingly to adopt a binding framework that compels signatories to accelerate emissions reductions by nearly half before 2035.',
                    'The breakthrough came in the early hours of Tuesday, when a bloc of large-emitting economies, led by Nigeria and Brazil, dropped earlier objections in exchange for a staggered compliance schedule and expanded access to a newly pledged $310bn transition fund.',
                    'Diplomats described the final hours as "exhausting but historic". Three delegations held out until the last minute over the mechanism for monitoring national progress, before agreeing to independent annual audits administered by the United Nations framework secretariat.',
                    'The text now moves to national legislatures for ratification. Analysts say the hard part is only beginning, with domestic politics likely to test the ambition agreed in Geneva.',
                    'For developing economies, the deal unlocks concessional financing for solar, grid and adaptation projects. Nigeria\'s delegation said it would immediately apply for funding to support its energy transition plan.',
                ],
            ],
            [
                'category' => 'politics',
                'title' => 'INEC opens recruitment portal for 2027 ad-hoc staff amid reform push',
                'subdeck' => 'The electoral commission says it will recruit over one million temporary staff and deploy new biometric devices for the general election.',
                'key_facts' => [
                    ['label' => 'Ad-hoc roles', 'value' => '1.2 million'],
                    ['label' => 'Portal opens', 'value' => 'This week'],
                    ['label' => 'New devices', 'value' => 'BVAS v3'],
                ],
                'edition' => 'Lagos',
                'is_breaking' => true,
                'image' => $this->img('INEC Recruitment'),
                'image_caption' => 'A training session for electoral officers in Abuja.',
                'tags' => ['Elections', 'INEC'],
                'body' => [
                    'The Independent National Electoral Commission has opened its recruitment portal for ad-hoc staff ahead of the 2027 general elections, seeking to hire more than 1.2 million temporary officials.',
                    'The commission said the exercise will prioritise applicants with teaching and civil-service experience, and will introduce a new generation of biometric accreditation devices designed to reduce polling-unit delays.',
                    'Civil society groups welcomed the early start but repeated calls for the National Assembly to pass amendments guaranteeing electronic transmission of results.',
                    'The recruitment drive is the latest step in a wider reform agenda that officials say will restore public confidence in the electoral process.',
                ],
            ],
            [
                'category' => 'business',
                'title' => 'Dangote refinery pushes Nigeria toward fuel self-sufficiency',
                'subdeck' => 'Africa\'s largest refinery has reached 650,000 barrels per day, cutting petrol imports to a two-decade low.',
                'key_facts' => [
                    ['label' => 'Capacity reached', 'value' => '650k bpd'],
                    ['label' => 'Import reduction', 'value' => '−41%'],
                    ['label' => 'Jobs created', 'value' => '35,000'],
                ],
                'data_graphic' => [
                    'title' => 'Monthly petrol imports',
                    'subtitle' => 'Millions of litres',
                    'xAxis' => ['Jan', 'Mar', 'May', 'Jul', 'Sep'],
                    'series' => [['name' => 'Imports', 'data' => [1800, 1500, 1150, 800, 620]]],
                ],
                'edition' => 'Lagos',
                'is_featured' => true,
                'is_premium' => true,
                'image' => $this->img('Dangote Refinery'),
                'image_caption' => 'The Dangote refinery complex outside Lagos at dusk.',
                'tags' => ['Energy', 'Economy', 'Refining'],
                'body' => [
                    'The Dangote refinery has reached 650,000 barrels per day of crude processing, a milestone that operators say is transforming Nigeria\'s fuel supply chain.',
                    'Official import data shows petrol shipments into the country fell 41% over the past six months as local refining ramped up, the lowest level in more than twenty years.',
                    'Industry analysts said the shift is easing pressure on foreign reserves and stabilising pump prices, though distribution bottlenecks and pricing transparency remain unresolved.',
                    'The refinery\'s operators plan to reach full capacity by year end and have begun exporting diesel and jet fuel to regional markets.',
                ],
            ],
            [
                'category' => 'technology',
                'title' => 'Nigerian fintech startups attract $1.2bn in funding as digital payments boom',
                'subdeck' => 'Investors are betting on Nigeria\'s fast-growing digital economy as cashless transactions hit record highs.',
                'key_facts' => [
                    ['label' => '2026 funding', 'value' => '$1.2bn'],
                    ['label' => 'Cashless growth', 'value' => '+34%'],
                    ['label' => 'Active wallets', 'value' => '78m'],
                ],
                'edition' => 'Lagos',
                'image' => $this->img('Fintech Lagos'),
                'image_caption' => 'Developers at a Lagos fintech hub.',
                'tags' => ['Fintech', 'Startups', 'Payments'],
                'body' => [
                    'Nigerian financial technology startups raised $1.2bn in the first three quarters of the year, cementing the country\'s position as Africa\'s leading fintech market.',
                    'Investors pointed to the rapid adoption of instant payments and mobile wallets as the primary driver, with the number of active accounts surpassing 78 million.',
                    'Regulators have responded with new rules aimed at protecting consumers while encouraging innovation, a balance that executives say will determine the sector\'s next phase of growth.',
                    'Several startups are now expanding beyond payments into lending, insurance and cross-border remittances, deepening the financial ecosystem.',
                ],
            ],
            [
                'category' => 'culture',
                'title' => 'Afrobeats star Larry Vibez releases new single "Muller Tune" featuring Terry Apala',
                'subdeck' => 'The collaboration blends Afrobeats with Apala, marking a bold cross-genre experiment from two of Lagos\' most distinctive voices.',
                'edition' => 'Lagos',
                'image' => $this->img('Larry Vibez'),
                'image_caption' => 'Larry Vibez in the studio.',
                'tags' => ['Afrobeats', 'Music'],
                'body' => [
                    'Larry Vibez has released "Muller Tune", a new single featuring Apala singer Terry Apala, in a collaboration that fuses contemporary Afrobeats with traditional Yoruba percussion.',
                    'The track, produced in Lagos, arrives as global demand for Nigerian music continues to grow, with streaming platforms reporting double-digit growth in the region.',
                    'Fans and critics have praised the record for its melodic range and the chemistry between the two artists, who first met at a festival in 2025.',
                    'The single is expected to anchor a larger project due later this year, according to the artist\'s label.',
                ],
            ],
            [
                'category' => 'sport',
                'title' => 'Super Eagles begin preparations for World Cup qualifier in Russia',
                'subdeck' => 'The national team held its first training session in Antalya ahead of Tuesday\'s friendly against Russia.',
                'edition' => 'Lagos',
                'image' => $this->img('Super Eagles'),
                'image_caption' => 'Super Eagles players during a training session in Turkey.',
                'tags' => ['Football', 'Super Eagles'],
                'body' => [
                    'The Super Eagles opened their training camp in Antalya, Turkey, on Friday as preparations intensify for Tuesday\'s international friendly against Russia.',
                    'The head coach and his staff ran the squad through a light session focused on shape and pressing, with the full squad available following late arrivals.',
                    'The match forms part of a wider build-up to the resumption of World Cup qualifying, where Nigeria sit in a competitive position in their group.',
                    'Supporters are expected to travel in numbers, with the federation arranging charter options for fans based in Europe.',
                ],
            ],
            [
                'category' => 'opinion',
                'title' => 'Nigeria at 66: time to harness all our resources',
                'subdeck' => 'As the country marks another independence anniversary, the urgent task is converting potential into prosperity.',
                'co_authors' => [['name' => 'The Editorial Board', 'role' => 'Opinion']],
                'edition' => 'Lagos',
                'is_featured' => true,
                'image' => $this->img('Independence Editorial'),
                'tags' => ['Editorial', 'Independence'],
                'body' => [
                    'As Nigeria marks sixty-six years of independence, the familiar ritual of introspection returns. The ledger of progress is mixed, but the direction of travel is no longer in doubt: the country\'s greatest untapped resource is its own people.',
                    'Energy, technology and the creative economy all show what is possible when policy, capital and talent align. The task for the next chapter is scale — converting isolated success stories into durable, nationwide prosperity.',
                    'That will require difficult decisions on governance, security and the management of public finances. Anniversaries are not only for celebration; they are for renewal of resolve.',
                    'The Daily Brief stands for clear-eyed reporting on these questions, and for the readers who insist that their country can do better.',
                ],
            ],
            [
                'category' => 'education',
                'title' => 'World Bank, FG to train 80,000 youths under expanded skills programme',
                'subdeck' => 'The IDEAS project\'s third cohort will equip young Nigerians with technical and vocational skills to bridge the employment gap.',
                'key_facts' => [
                    ['label' => 'Trainees', 'value' => '80,000'],
                    ['label' => 'States covered', 'value' => '18'],
                    ['label' => 'Duration', 'value' => '6 months'],
                ],
                'edition' => 'Lagos',
                'image' => $this->img('Skills Training'),
                'image_caption' => 'Trainees at a vocational centre in Abuja.',
                'tags' => ['Education', 'Skills'],
                'body' => [
                    'The Federal Government, in partnership with the World Bank, has commenced the third cohort of a skills programme that aims to train 80,000 young Nigerians in technical and vocational disciplines.',
                    'The initiative, known as the IDEAS project, targets skills gaps in manufacturing, digital services and construction, and has so far reached 18 states.',
                    'Officials say the programme is designed to close the gap between education and employment, with a focus on placing graduates directly into jobs or self-employment.',
                    'Participants receive stipends and toolkits, and the project includes a mentorship component linking trainees to established enterprises.',
                ],
            ],
            [
                'category' => 'health',
                'title' => 'Kaduna upgrades 17 primary healthcare centres, deploys rural ambulances',
                'subdeck' => 'The state government says the investment will improve access for more than two million residents in underserved areas.',
                'key_facts' => [
                    ['label' => 'Centres upgraded', 'value' => '17'],
                    ['label' => 'Ambulances deployed', 'value' => '30'],
                    ['label' => 'People reached', 'value' => '2m+'],
                ],
                'edition' => 'Lagos',
                'image' => $this->img('Healthcare Kaduna'),
                'tags' => ['Health', 'Primary Care'],
                'body' => [
                    'The Kaduna State Government has completed the upgrade of 17 primary healthcare centres and deployed 30 ambulances to rural communities as part of a broader push to strengthen basic healthcare.',
                    'The upgrades include solar power, improved maternity wards and essential drug supplies, targeting areas that previously relied on distant referral facilities.',
                    'Health officials said the investment would bring routine immunisation, maternal care and emergency response within reach of more than two million residents.',
                    'Community leaders welcomed the initiative but urged sustained funding to prevent the facilities from falling back into disrepair.',
                ],
            ],
            [
                'category' => 'interview',
                'title' => 'Africa\'s next chapter must be written by its youth, says Abdou Samb',
                'subdeck' => 'The president of the Abdou Samb Foundation on education, migration and the demographic opportunity facing the continent.',
                'co_authors' => [['name' => 'The Daily Brief', 'role' => 'Interview']],
                'edition' => 'International',
                'is_premium' => true,
                'image' => $this->img('Abdou Samb Interview'),
                'tags' => ['Interview', 'Africa'],
                'body' => [
                    'In a wide-ranging conversation, Abdou Samb, president of the Abdou Samb Foundation, argued that Africa\'s demographic growth is either its greatest asset or its greatest risk, depending on the investments made this decade.',
                    '"We cannot keep exporting our talent while importing our problems," he said, calling for a continental commitment to education, skills and the free movement of people.',
                    'Samb pointed to the creative and technology sectors as proof that young Africans can compete globally when given the tools, and urged governments to remove barriers to entrepreneurship.',
                    'The full interview, covering migration, education reform and the role of diaspora investment, is available to subscribers.',
                ],
            ],
            [
                'category' => 'business',
                'title' => 'InfraCredit secures $50m IFC facility to expand infrastructure financing',
                'subdeck' => 'The deal will support credit enhancement for municipal and private infrastructure projects across Nigeria.',
                'edition' => 'Lagos',
                'image' => $this->img('InfraCredit'),
                'tags' => ['Infrastructure', 'Finance'],
                'body' => [
                    'InfraCredit has secured a $50m facility from the International Finance Corporation to expand its capacity to guarantee long-term infrastructure bonds.',
                    'The company said the funding would allow it to back more municipal and private projects in energy, transport and water, catalysing private capital into public infrastructure.',
                    'Analysts described the deal as a vote of confidence in Nigeria\'s infrastructure financing framework, which has struggled to attract long-term debt.',
                    'InfraCredit has already supported projects worth billions of naira since its founding, and says the new facility will triple its annual issuance capacity.',
                ],
            ],
            [
                'category' => 'world',
                'title' => 'West African bloc pushes intra-African trade at FATI Expo',
                'subdeck' => 'Stakeholders called for faster implementation of the African Continental Free Trade Area to unlock regional investment.',
                'edition' => 'International',
                'image' => $this->img('FATI Expo'),
                'tags' => ['Trade', 'AfCFTA'],
                'body' => [
                    'Trade and investment leaders gathered at the FATI Expo in Lagos this week to accelerate implementation of the African Continental Free Trade Area, describing the agreement as the continent\'s most important economic lever.',
                    'Speakers highlighted persistent barriers, including poor logistics and fragmented payment systems, that continue to slow the movement of goods and services across borders.',
                    'Participants agreed on a series of measures to simplify customs procedures and connect national payment rails, with a working group to report back within six months.',
                    'Organisers said the expo had facilitated hundreds of business-to-business meetings between firms across West and Southern Africa.',
                ],
            ],
            [
                'category' => 'breaking-news',
                'title' => 'Troops rescue eight NYSC members abducted along Onitsha–Owerri expressway',
                'subdeck' => 'Security forces rescued the prospective corps members after a firefight in Imo State.',
                'edition' => 'Lagos',
                'is_breaking' => true,
                'image' => $this->img('Troops Rescue'),
                'tags' => ['Security', 'Metro'],
                'body' => [
                    'Soldiers of Operation UDO KA have rescued eight prospective National Youth Service Corps members who were abducted along the Onitsha–Owerri expressway in Imo State.',
                    'The victims were among passengers travelling in two commercial buses when gunmen intercepted them, according to a military statement.',
                    'Troops engaged the assailants in a gun battle before securing the release of the abductees, who are receiving medical attention.',
                    'Security agencies have urged motorists to avoid night travel along the corridor while operations continue.',
                ],
            ],
            [
                'category' => 'energy',
                'title' => 'Solar adoption increasingly depends on financing as businesses weigh costs',
                'subdeck' => 'Reliable power remains the goal, but access to affordable financing is now the deciding factor for many companies.',
                'key_facts' => [
                    ['label' => 'Solar demand growth', 'value' => '+28%'],
                    ['label' => 'Avg. payback', 'value' => '4.2 years'],
                ],
                'edition' => 'Lagos',
                'image' => $this->img('Solar Nigeria'),
                'tags' => ['Energy', 'Solar'],
                'body' => [
                    'Rising electricity costs and unreliable supply are driving record interest in solar energy among Nigerian businesses, but access to financing is increasingly determining whether projects move forward.',
                    'Industry providers say the pipeline of commercial and industrial solar projects has grown 28% this year, with manufacturing and retail leading demand.',
                    'The challenge, according to installers, is that most firms want to avoid large upfront capital expenditure, favouring pay-as-you-go or power-purchase models.',
                    'Lenders are responding with dedicated green-finance products, though analysts say interest rates remain a barrier for smaller enterprises.',
                ],
            ],
        ];
    }
}
