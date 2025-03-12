import BlogPostClient from './BlogPostClient';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Art of Pizza Making: From Dough to Delicious',
    content: `
      <p>Pizza making is both an art and a science. The perfect pizza starts with the foundation: the dough. A good pizza dough requires just a few simple ingredients - flour, water, yeast, and salt - but the magic lies in the technique and patience.</p>

      <h2>The Perfect Dough</h2>
      <p>The key to great pizza dough is proper fermentation. A slow fermentation process, typically 24-72 hours, allows the flavors to develop fully and creates a more digestible crust. The dough should be elastic and smooth, with a slight tackiness but not sticky.</p>

      <h2>Choosing Your Toppings</h2>
      <p>While the classic Margherita remains a favorite, modern pizza allows for endless creativity. The key is balance - both in flavor and quantity. Remember: sometimes less is more.</p>

      <h2>The Baking Process</h2>
      <p>Temperature is crucial. A hot oven, preferably 450-500°F (230-260°C), ensures a crispy crust and perfectly melted cheese. A pizza stone or steel can help achieve that coveted crispy bottom.</p>
    `,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&auto=format&fit=crop&q=60',
    author: 'Chef Maria',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Cooking Tips',
  },
  {
    id: 2,
    title: 'Healthy Eating: Balance and Taste',
    content: `
      <p>Maintaining a healthy diet doesn't mean sacrificing flavor. The key is understanding how to combine nutritious ingredients in ways that create satisfying and delicious meals.</p>

      <h2>The Basics of Balanced Nutrition</h2>
      <p>A balanced meal should include proteins, carbohydrates, healthy fats, and plenty of vegetables. This combination ensures you get all necessary nutrients while keeping you full and satisfied.</p>

      <h2>Smart Substitutions</h2>
      <p>Learn to make healthy swaps in your favorite recipes. Use Greek yogurt instead of sour cream, try cauliflower rice instead of white rice, or experiment with natural sweeteners instead of refined sugar.</p>

      <h2>Meal Planning Tips</h2>
      <p>Successful healthy eating starts with good planning. Prepare meals in advance, keep healthy snacks readily available, and learn to read nutrition labels effectively.</p>
    `,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60',
    author: 'Nutritionist Sarah',
    date: 'March 12, 2024',
    readTime: '4 min read',
    category: 'Health',
  },
  {
    id: 3,
    title: 'Food Photography: Making Dishes Look Irresistible',
    content: `
      <p>Food photography is about more than just pointing and shooting. It's about telling a story through visual elements and making the viewer feel hungry just by looking at the image.</p>

      <h2>Lighting is Everything</h2>
      <p>Natural light is your best friend in food photography. Position your subject near a window but avoid direct sunlight. Use diffusers and reflectors to control shadows and highlights.</p>

      <h2>Composition Techniques</h2>
      <p>Learn to use the rule of thirds, leading lines, and negative space. These fundamental principles help create visually appealing images that draw the viewer's attention to the right places.</p>

      <h2>Styling Tips</h2>
      <p>Fresh herbs, textured surfaces, and complementary props can enhance your food photos. Remember to keep the focus on the food while using props to add context and interest.</p>
    `,
    image: 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=800&auto=format&fit=crop&q=60',
    author: 'John Smith',
    date: 'March 10, 2024',
    readTime: '6 min read',
    category: 'Photography',
  },
];

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    id: post.id.toString(),
  }));
}

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = BLOG_POSTS.find(p => p.id === parseInt(params.id));
  
  if (!post) {
    return null;
  }

  return <BlogPostClient post={post} />;
}