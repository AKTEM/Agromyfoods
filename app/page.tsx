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
    name: 'Ijebu Garri 1kg',
    description: 'Super crunchy ijebu garri',
    price: 2000,
    image:  "/img/Garri-1kg.jpg",
    category: 'Ijebu Garri',
  },
  {
    id: '2',
    name:  'Ijebu Garri 2kg',
    description: 'Super crunchy ijebu garri',
    price: 4000,
    image: "/img/Garri-2kg.jpg",
    category:'Ijebu Garri',
  },
  {
    id: '3',
      name: 'Ijebu Garri 2.5kg',
      description: 'Super crunchy ijebu garri',
      price: 5000,
      image:  "/img/Garri-2.5kg.jpg",
      category: 'Ijebu Garri',
  },
  {
    id: '4',
    name: 'Ijebu Garri 5kg',
    description: 'Super crunchy ijebu garri',
    price: 10000,
    image: "/img/Garri-5kg.jpg" ,
    category: 'Ijebu Garri',
  },
 {
    id: '5',
    name: 'Kilishi 50grams',
    description: 'Spicy and tasty beef jerky(kilishi)',
    price: 2500,
    image:  "/img/K50.jpg",
    category: 'Kilishi',
  },
  {
    id: '6',
    name: 'Kilishi 100grams',
    description: 'Spicy and tasty beef jerky(kilishi)',
    price: 3000,
    image: "/img/K100.jpg",
    category: 'Kilishi',
  },
  {
    id: '7',
    name: 'Kilishi 250grams',
    description: 'Spicy and tasty beef jerky(kilishi)',
    price: 7000,
    image: "/img/K250.jpg",
    category: 'Kilishi',
  },
  {
    id: '8',
    name: 'Kilishi 500grams',
    description: 'Spicy and tasty beef jerky(kilishi)',
    price: 14500,
    image: "/img/K500.jpg",
    category: 'Kilishi',
  },
  {
    id: '9',
    name: 'Kilishi 1kg',
    description: 'Spicy and tasty beef jerky(kilishi)',
    price: 28000,
    image: "/img/K1kg.jpg",
    category: 'Kilishi',
  },
  {
    id: '10',
    name: 'Palm oil 75cl',
    description: 'Natural, unadulterated palm oil',
    price: 2000,
    image: "/img/P75.jpg",
    category: 'Palm oil',
  },
  {
    id: '11',
    name: 'Palm oil 1litre',
    description: 'Natural, unadulterated palm oil',
    price: 2500,
    image: "/img/P1L.jpg",
    category: 'Palm oil',
  },
  {
    id: '12',
    name: 'Palm oil 5litres',
    description: 'Natural, unadulterated palm oil',
    price: 2000,
    image: "/img/P25.jpg",
    category: 'Palm oil',
 },
 {
  id: '13',
  name: 'Palm oil 25litres',
  description: 'Natural, unadulterated palm oil',
  price: 48000,
  image: "/img/P25L.jpg",
  category: 'Palm oil',
},
{
  id: '14',
  name: 'Curry Masala Spice 100gram',
  description: 'Natural, Quality Spice',
  price: 2500,
  image: "/img/CURRY.jpg",
  category:'Spices',
},
{
  id: '15',
  name: 'Peppersoup Spice 100grams',
  description: 'Natural, Quality Spice',
  price: 2500,
  image: "/img/PEPPERSOUP.jpg",
  category:'Spices',
},
{
  id: '16',
  name: 'Suya spice 100grams',
  description: 'Natural, Quality Spice',
  price: 2500,
  image: "/img/SUYA.jpg",
  category:'Spices',
},
{
  id: '17',
  name: 'Ginger, garlic & onions 100grams',
  description: 'Natural, Quality Spice',
  price: 2500,
  image: "/img/GGO.jpg",
  category:'Spices',
},
{
  id: '18',
  name: ' All purpose spice 100grams',
  description: 'Natural, Quality Spice',
  price: 2500,
  image: "/img/ALL.jpg",
  category:'Spices',
},
{
  id: '19',
  name: ' Jollof Spice 100grams',
  description: 'Natural, Quality Spice',
  price: 2500,
  image: "/img/Jollof.jpg",
  category:'Spices',
},

];

// Testimonials data
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Chioma A.',
    comment: 'The Kilishi was absolutely delicious! Perfectly spiced and Very Beautiful Packaging.',
    rating: 5,
    image: "/img/f1.jpg",
  },
  {
    id: 2,
    name: 'Emeka O.',
    comment: 'Good Palm Oil & Kilishi is top notch',
    rating: 5,
    image: "/img/m1.jpg",
  },
  {
    id: 3,
    name: 'Funke B.',
    comment: 'Correct Garri Ijebu, Suya Spice is on point,  Will order again!',
    rating: 4,
    image: "/img/f2.jpg",
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
                We sell super quality packaged food items
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
                We deliver Nationwide/Worldwide
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
              Don't just take our word for it. Here's what our satisfied customers have to say about our food items and service.
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
              Have questions or feedback? We'd love to hear from you. Reach out to us.
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
              <p className="text-muted-foreground">+234 907 792 3199</p>
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
                title: 'Health benefits of Palm oil',
                excerpt: 'Discover the Health benefits of Palm oil',
                image: "/img/P1L.jpg",
                date: 'March 15, 2025',
              },
              {
                id: 2,
                title: 'Health benefits of Garri',
                excerpt: 'Discover the Health benefits of Garri',
                image: "/img/Garri-2kg.jpg",
                date: 'March 12, 2025',
              },
              {
                id: 3,
                title: 'Health benefits of Kilishi',
                excerpt: 'Discover the Health benefits of Kilishi',
                image:   "/img/K500.jpg",
                date: 'March 10, 2025',
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
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Agromyfoods</h3>
              <p className="text-muted-foreground mb-4">
               For Bulk & Wholesale Orders, We Sell at Discounted Prices.
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
                    Shop
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
                <li>Agbeke Close, Obadeyi-Ijaiye, Lagos</li>
                <li>Lagos, Nigeria</li>
                <li>Phone: +234 907 792 3199</li>
                <li>Email: info@agromyfoods.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Monday - Friday: 9am - 10pm</li>
                <li>Saturday: 8am - 10pm</li>
               
              </ul>
            </div>
          </div>
          <div className="border-t pt-8">
            <div className="text-center text-muted-foreground">
              <p>© 2025 Agromyfoods. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}