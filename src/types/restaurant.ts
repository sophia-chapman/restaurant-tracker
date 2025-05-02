export type Rating = 'good' | 'okay' | 'bad';

export interface Restaurant {
  id?: string;
  _id?: string;
  name: string;
  location: string[];
  vibeTags: string[];
  cuisineType: string;
  rating: Rating;
  order: string;
  description: string;
  visitedDate: string;
  favorite: boolean;
}

export interface RestaurantFilters {
  name?: string;
  location?: string;
  cuisineType?: string;
  rating?: Rating;
} 