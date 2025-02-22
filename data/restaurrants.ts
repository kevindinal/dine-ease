export type Restaurant = {
    id: number;
    name: string;
    image: string;
    bannerImage: string;
    rating: number;
    reviews: number;
    cuisine: string[];
    category: string;
    priceRange: string;
    location: string;
    featuredMenu: { name: string; price: string; image: string }[]; // Updated key
    photos: string[];
    times: string[];
    address: string;
    description: string;
    about: string;
  };
  
  export const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "FLOW - Hilton Colombo Residences",
      image: "https://hiltoncolombo1.com/uploads/poster/6881610003007Cover1.jpg",
      bannerImage: "https://resizer.otstatic.com/v2/photos/wide-xlarge/2/41686450.jpg",
      rating: 5,
      reviews: 120,
      cuisine: ["International", "Sri Lankan", "Chineese"],
      category: "Global, International - $$$",
      priceRange: "$$$",
      description: "Experience Modern Asian Fusion Dining",
      about: "FLOW Restaurant at Hilton Colombo Residences offers an exceptional dining experience, featuring a diverse menu that spans Sri Lankan, Indian, Chinese, Japanese, and Western cuisines. Our casual elegant atmosphere provides the perfect setting for both intimate dinners and business meetings",
      address: "279/6 Hospital Road",
      location: "Hilton Colombo, Sri Lanka",
      featuredMenu: [
        { name: "Grilled Salmon", price: "$32", image: "https://www.dinneratthezoo.com/wp-content/uploads/2019/05/grilled-salmon-final-2.jpg" },
        { name: "Pan-Seared Duck", price: "$38", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCH9SwLz4kQKwXhf8lzDnoupISsGn9RNpdXw&s" },
        { name: "Truffle Pasta", price: "$28", image: "https://www.milkandhoneynutrition.com/wp-content/uploads/2020/12/truffle-mushroom-pasta-5.jpg" },
      ],
      photos: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/612342474.jpg?k=027a217399df0ebe6e714352acfcb5b135be0a32a1b8a46adcebbc1f2b2a4a19&o=&hp=1",
        "https://hiltoncolombo1.com/resturant-gallery/4911708326618gk-g2.jpg",
        "https://c7.staticflickr.com/6/5799/30508881102_8384b152a7_b.jpg",
        "https://cdn.squaremeal.co.uk/restaurants/2747/images/waldorf-7_05012024112304.jpg?w=1200&h=800&fit=crop&auto=format%2Ccompress",
      ],
      times: ["12:00 PM", "12:15 PM", "12:30 PM"],
    },
  ];
  