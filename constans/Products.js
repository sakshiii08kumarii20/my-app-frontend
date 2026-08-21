export const PRODUCTS = [
    { id: '1', name: 'Full Cream Milk', unit: '500ml', price: 32, mrp: 36, rating: 4.6, reviews: '18.2k', color: '#023E8A', category: 'Milk',
      description: 'Farm-fresh full cream milk, pasteurized and homogenized. Rich in calcium and protein, delivered chilled every morning.' },
    { id: '2', name: 'Toned Milk', unit: '1L', price: 58, mrp: 64, rating: 4.5, reviews: '22.5k', color: '#0077B6', category: 'Milk',
      description: 'Standardized toned milk with balanced fat content. A daily household staple, sourced from trusted local farms.' },
    { id: '3', name: 'Fresh Curd', unit: '400g', price: 40, mrp: 45, rating: 4.4, reviews: '9.7k', color: '#48CAE4', category: 'Curd & Yogurt',
      description: 'Thick, creamy curd set the traditional way. No added preservatives, packed fresh daily.' },
    { id: '4', name: 'Greek Yogurt', unit: '200g', price: 65, mrp: 75, rating: 4.3, reviews: '4.1k', color: '#00B4D8', category: 'Curd & Yogurt',
      description: 'High-protein strained yogurt with a smooth, thick texture. Great on its own or as a smoothie base.' },
    { id: '5', name: 'Paneer', unit: '200g', price: 85, mrp: 95, rating: 4.5, reviews: '11.3k', color: '#0096C7', category: 'Paneer',
      description: 'Soft, fresh cottage cheese made from full-fat milk. Cut and packed the same day for maximum freshness.' },
    { id: '6', name: 'Pure Cow Ghee', unit: '500ml', price: 320, mrp: 360, rating: 4.7, reviews: '15.8k', color: '#023E8A', category: 'Ghee & Butter',
      description: 'Traditionally prepared cow ghee with a rich aroma. Made using the bilona method from farm-fresh milk.' },
    { id: '7', name: 'Salted Butter', unit: '100g', price: 55, mrp: 60, rating: 4.4, reviews: '7.2k', color: '#0077B6', category: 'Ghee & Butter',
      description: 'Creamy table butter, lightly salted. Perfect for spreading, baking, and everyday cooking.' },
    { id: '8', name: 'Processed Cheese Slices', unit: '200g (10 slices)', price: 110, mrp: 125, rating: 4.1, reviews: '5.9k', color: '#48CAE4', category: 'Cheese',
      description: 'Ready-to-use cheese slices, perfect for sandwiches and burgers. Consistent melt and mild flavor.' },
    { id: '9', name: 'Masala Buttermilk', unit: '500ml', price: 25, mrp: 28, rating: 4.2, reviews: '6.4k', color: '#00B4D8', category: 'Buttermilk',
      description: 'Spiced, chilled buttermilk made from fresh curd. A refreshing, probiotic-rich drink for any time of day.' },
    { id: '10', name: 'Vanilla Ice Cream Tub', unit: '700ml', price: 180, mrp: 210, rating: 4.6, reviews: '13.5k', color: '#0096C7', category: 'Ice Cream',
      description: 'Classic vanilla ice cream made with real dairy cream. No artificial flavoring, just pure indulgence.' },
]

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id)