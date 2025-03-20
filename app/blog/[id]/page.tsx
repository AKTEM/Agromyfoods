import BlogPostClient from './BlogPostClient';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Health benefits of Palm oil',
    content: `
      <p></p>Palm oil, a common cooking ingredient in many African and tropical cuisines, has several health benefits when consumed in moderation. Here are some of its key advantages:

1. Rich in Healthy Fats
Palm oil contains a balance of saturated and unsaturated fats, which provide a good source of energy and support overall health.
It is free of trans fats, which are harmful to heart health.
2. High in Vitamin E (Tocotrienols & Tocopherols)
Palm oil is rich in tocotrienols, a powerful form of vitamin E that acts as an antioxidant.
These compounds help protect cells from oxidative damage and may reduce the risk of chronic diseases like heart disease and cancer.
3. Supports Heart Health (When Consumed in Moderation)
Some studies suggest that red palm oil (unrefined) may help improve cholesterol levels by increasing good HDL cholesterol and lowering bad LDL cholesterol.
4. Good for Eye Health
Palm oil is loaded with beta-carotene (a precursor to vitamin A), which is essential for good vision and preventing night blindness.
5. Boosts Immune System
The antioxidants and vitamin A in palm oil help strengthen the immune system and improve the body’s ability to fight infections.</p>

     
    `,
    image: "/img/P1L.jpg",
    author: 'Chef Maria',
    date: 'March 15, 2025',
    readTime: '5 min read',
    category: 'Cooking Tips',
  },
  {
    id: 2,
    title: 'Health benefits of Garri',
    content: `
      <p>Garri, a popular West African staple made from processed cassava, has several health benefits when consumed in moderation. Here are some key benefits:

</p>

      <h2>1. Rich in Carbohydrates for Energy
Garri is a great source of carbohydrates, providing quick and sustained energy, making it ideal for those who need an energy boost.
2. Good for Digestion
Garri contains dietary fiber (especially the less-refined variants) that aids digestion and prevents constipation.
3. Supports Eye Health
It contains small amounts of vitamin A (from yellow garri, which is fortified with palm oil), which can help improve vision and prevent eye-related issues.
4. Boosts Immune System
The presence of vitamin C in cassava (before processing) helps support the immune system and fight infections.
5. Helps in Hydration
Drinking garri (soaked in water) can help keep the body hydrated, especially in hot climates.
6. Gluten-Free Alternative
Since garri is made from cassava, it is naturally gluten-free and can be a good option for people with gluten intolerance or celiac disease..</h2>
      
    `,
    image: "/img/Garri-2kg.jpg",
    author: 'Nutritionist Sarah',
    date: 'March 12, 2025',
    readTime: '4 min read',
    category: 'Health',
  },
  {
    id: 3,
    title: 'Health benefits of Kilishi',
    content: `
      <p>Kilishi, a Nigerian-style dried and spiced meat (similar to beef jerky), has several health benefits when consumed in moderation. Here are some of the key advantages:

1. High in Protein
Kilishi is a rich source of high-quality protein, which is essential for muscle growth, tissue repair, and overall body function.
Protein also helps keep you full for longer, aiding in weight management.
2. Rich in Essential Amino Acids
Being a meat product, kilishi provides all the essential amino acids needed for body functions, including muscle development and immune support.
3. Good Source of Iron
Kilishi contains iron, which is important for red blood cell production and preventing anemia.
Iron helps transport oxygen throughout the body, reducing fatigue and boosting energy levels.
4. Supports Immune System
The spices used in kilishi (such as ginger, garlic, and chili pepper) contain antioxidants and anti-inflammatory properties that help strengthen the immune system.
5. Low in Carbohydrates
Kilishi is naturally low in carbs, making it a great snack for people following low-carb or ketogenic diets.</p>

    `,
    image: "/img/K500.jpg",
    author: 'Mrs Lawrence',
    date: 'March 10, 2025',
    readTime: '6 min read',
    category: 'Health',
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