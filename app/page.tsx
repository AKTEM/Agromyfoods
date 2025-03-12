'use client';
import Image from "next/image";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import CountUpSection from '@/components/CountUpSection';

// Featured products data
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Jollof Rice with Chicken',
    description: 'Spicy jollof rice served with grilled chicken and plantains',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop&q=60',
    category: 'Main Dish',
  },
  {
    id: '2',
    name: 'Egusi Soup with Pounded Yam',
    description: 'Traditional Nigerian egusi soup served with smooth pounded yam',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1643275590906-abe3e90ea426?w=800&auto=format&fit=crop&q=60',
    category: 'Soup',
  },
  {
    id: '3',
    name: 'Suya Platter',
    description: 'Spicy grilled beef skewers with onions and tomatoes',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60',
    category: 'Appetizer',
  },
  {
    id: '4',
    name: 'Moin Moin with Fried Rice',
    description: 'Steamed bean pudding served with colorful fried rice',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=60',
    category: 'Main Dish',
  },
  {
    id: '5',
    name: 'Pepper Soup',
    description: 'Spicy and aromatic meat soup with herbs and spices',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=60',
    category: 'Soup',
  },
  {
    id: '6',
    name: 'Akara with Pap',
    description: 'Fried bean cakes served with sweet corn porridge',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop&q=60',
    category: 'Breakfast',
  },
];

// Testimonials data
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Chioma A.',
    comment: 'The jollof rice was absolutely delicious! Perfectly spiced and the delivery was prompt.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Emeka O.',
    comment: 'Best egusi soup in Lagos! The pounded yam was smooth and the soup was rich with meat and seafood.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Funke B.',
    comment: 'The suya platter was amazing. Perfectly spiced and the meat was tender. Will order again!',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60',
  },
];

export default function Home() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fix: Convert Set to Array before spreading
  const uniqueCategories = Array.from(new Set(FEATURED_PRODUCTS.map(product => product.category)));
  const categories = ['All', ...uniqueCategories];
  
  const filteredProducts = selectedCategory === 'All' 
    ? FEATURED_PRODUCTS 
    : FEATURED_PRODUCTS.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  // Animation variants for the title
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        damping: 12,
        stiffness: 100
      } 
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 8,
        stiffness: 100,
        delay: 0.4
      } 
    }
  };

  // Split the title into words for animation
  const titleWords = ["Your", "Best", "Plug", "for", "Packaged"];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-green-900 dark:to-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2 mb-10 lg:mb-0"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600 dark:text-green-400 mb-4"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                {titleWords.map((word, index) => (
                  <motion.span 
                    key={index} 
                    className="inline-block mr-3"
                    variants={wordVariants}
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span 
                  className="inline-block"
                  variants={highlightVariants}
                >
                  <span className="text-[#e2b53e] relative">
                    Food Items
                    <motion.span 
                      className="absolute -bottom-2 left-0 w-full h-1 bg-[#e2b53e]"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    />
                  </span>
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                For Personal Consumption, Bulk Orders, Wholesales, Souvenirs and Others
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg" asChild>
                  <a href="#menu">Order Now</a>
                </Button>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg" asChild>
                  <Link href="/blog">Our Blog</Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <img 
                src="/img/abt.png" 
                alt="Delicious Food" 
                width={800} 
                height={600} 
                className="rounded-lg w-full h-auto object-cover" 
               
              />
            </motion.div>
          </div>
        </div>
      </section>

      
      {/* About Section - Moved under Hero Section */}
      <section id="about" className="py-16 bg-white dark:bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <img
              src="/img/abt2.jpg" 
                alt="Our Products"
                className="rounded-lg shadow-xl w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                About Agromyfoods
              </h2>
              <p className="text-muted-foreground mb-4">
              At Agromyfoods, We are dedicated to bringing you the freshest and highest-quality food items, delivered conveniently to your doorstep.
              </p>
              <p className="text-muted-foreground mb-4">
              Our mission is to make grocery shopping seamless and stress-free by offering a wide selection of locally sourced and carefully curated products.
              </p>
              <p className="text-muted-foreground mb-6">
              With a commitment to excellence and customer satisfaction, we ensure every order is handled with care, making healthy and delicious food more accessible to everyone in Nigeria.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">Learn More</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CountUp Section - Added after About Section */}
      <CountUpSection />

      {/* Features Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-card p-6 rounded-lg text-center shadow-md"
            >
              <div className="bg-green-100 dark:bg-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
               Our Deliveries are Fast and Swift.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-card p-6 rounded-lg text-center shadow-md"
            >
              <div className="bg-green-100 dark:bg-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food Items</h3>
              <p className="text-muted-foreground">
                We Sell Super Quality packaged food items
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-card p-6 rounded-lg text-center shadow-md"
            >
              <div className="bg-green-100 dark:bg-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
              <p className="text-muted-foreground">
                We deliver to all major areas in Lagos & Ogun State with no minimum order.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              Our Shop
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of Our Food items.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "border-green-600 text-green-600 hover:bg-green-50"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">₦{product.price.toFixed(2)}</span>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our food and service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Reach out to us using any of the methods below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground">Agbeke Close, Obadeyi-Ijaiye area, Lagos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground">+234 123 456 7890</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-green-100 dark:bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">info@agromyfoods.com</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Latest from Our Blog
            </h2>
            <Button variant="outline" className="border-green-600 text-green-600" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: 'The Art of Pizza Making: From Dough to Delicious',
                excerpt: 'Discover the secrets behind making the perfect pizza, from kneading the dough to choosing the right toppings.',
                image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&auto=format&fit=crop&q=60',
                date: 'March 15, 2024',
              },
              {
                id: 2,
                title: 'Healthy Eating: Balance and Taste',
                excerpt: 'Learn how to maintain a balanced diet without sacrificing flavor. Tips and tricks for healthy meal preparation.',
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60',
                date: 'March 12, 2024',
              },
              {
                id: 3,
                title: 'Food Photography: Making Dishes Look Irresistible',
                excerpt: 'Professional tips for taking stunning food photos that will make your dishes look as good as they taste.',
                image: 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=800&auto=format&fit=crop&q=60',
                date: 'March 10, 2024',
              },
            ].map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.id}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                    <h3 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-green-600 hover:text-green-700">
                      <span className="text-sm font-medium">Read More</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-card mt-auto pt-16 pb-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">FoodHub</h3>
              <p className="text-muted-foreground mb-4">
                Delivering delicious food right to your doorstep. Quality ingredients, exceptional taste.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-green-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#menu" className="text-muted-foreground hover:text-green-600 transition-colors">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-green-600 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-muted-foreground hover:text-green-600 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Agbeke Close, Obadeyi-Ijaiye</li>
                <li>Lagos, Nigeria</li>
                <li>Phone: +234 123 456 7890</li>
                <li>Email: info@foodhub.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Monday - Friday: 10am - 10pm</li>
                <li>Saturday: 11am - 11pm</li>
                <li>Sunday: 11am - 9pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8">
            <div className="text-center text-muted-foreground">
              <p>© 2024 FoodHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}