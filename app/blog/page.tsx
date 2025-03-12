'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, User } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Art of Pizza Making: From Dough to Delicious',
    excerpt: 'Discover the secrets behind making the perfect pizza, from kneading the dough to choosing the right toppings.',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&auto=format&fit=crop&q=60',
    author: 'Chef Maria',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Cooking Tips',
  },
  {
    id: 2,
    title: 'Healthy Eating: Balance and Taste',
    excerpt: 'Learn how to maintain a balanced diet without sacrificing flavor. Tips and tricks for healthy meal preparation.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60',
    author: 'Nutritionist Sarah',
    date: 'March 12, 2024',
    readTime: '4 min read',
    category: 'Health',
  },
  {
    id: 3,
    title: 'Food Photography: Making Dishes Look Irresistible',
    excerpt: 'Professional tips for taking stunning food photos that will make your dishes look as good as they taste.',
    image: 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=800&auto=format&fit=crop&q=60',
    author: 'John Smith',
    date: 'March 10, 2024',
    readTime: '6 min read',
    category: 'Photography',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      {/* Blog Header */}
      <div className="bg-gradient-to-b from-green-50 to-white dark:from-green-900 dark:to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-green-600 dark:text-green-400 mb-4">
            FoodHub Blog
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Discover culinary insights, cooking tips, and food stories from our expert chefs and food enthusiasts.
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <Button variant="link" className="text-green-600 hover:text-green-700" asChild>
                    <Link href={`/blog/${post.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}