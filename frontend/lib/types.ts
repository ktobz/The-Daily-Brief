export interface Author {
  id?: number;
  name: string;
  role?: string | null;
  avatar?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  color?: string;
  parent_id?: number | null;
  children?: Category[];
}

export interface DataGraphic {
  title?: string;
  subtitle?: string;
  xAxis?: string[];
  series?: { name: string; data: number[]; color?: string }[];
  value?: number;
  unit?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  subdeck?: string | null;
  body?: string | null;
  is_locked?: boolean;
  image?: string;
  image_caption?: string | null;
  key_facts?: { label: string; value: string }[];
  data_graphic?: DataGraphic | null;
  co_authors?: Author[];
  edition?: string | null;
  is_premium?: boolean;
  is_featured?: boolean;
  is_breaking?: boolean;
  read_time?: number;
  views?: number;
  published_at?: string | null;
  category?: { id: number; name: string; slug: string; color?: string } | null;
  author?: { name: string; role?: string | null } | null;
  tags?: string[];
}

export interface WireItem {
  id: number;
  title: string;
  slug: string;
  category?: string;
  published_at?: string | null;
}

export interface MarketIndicator {
  symbol: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  interval: string;
  tier?: string | null;
  features?: string[];
  formatted_price?: string;
}

export interface User {
  id: number;
  name: string;
  username?: string | null;
  email: string;
  role: string;
  avatar?: string | null;
  verified?: boolean;
  subscription?: { plan: string; status: string; ends_at?: string | null } | null;
}

export interface Comment {
  id: number | string;
  body: string;
  author_name: string;
  reactions?: number;
  verified?: boolean;
  created_at?: string;
}

export interface HomeData {
  lead: Article | null;
  hero: Article[];
  editors_picks: Article[];
  rails: { category: { id: number; name: string; slug: string; color?: string }; articles: Article[] }[];
  wire: WireItem[];
}
