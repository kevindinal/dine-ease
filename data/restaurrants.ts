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
        { name: "Potatoes - FrenchEntrée", price: "$78", image: "https://www.frenchentree.com/wp-content/uploads/2021/05/p058_French92-000-e1526033669896.png" },
        { name: "Gourmet Burger", price: "$18", image: "https://weberseasonings.com/wp-content/uploads/weber-burger-34.jpg" },
        { name: "Crispy Wrap", price: "$28", image: "https://cdn.tasteatlas.com//images/dishes/f4291f3e82f84c33a5997f801e8fb24f.jpg?w=375&h=280" },
      ],
      photos: [
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/612342474.jpg?k=027a217399df0ebe6e714352acfcb5b135be0a32a1b8a46adcebbc1f2b2a4a19&o=&hp=1",
        "https://hiltoncolombo1.com/resturant-gallery/4911708326618gk-g2.jpg",
        "https://c7.staticflickr.com/6/5799/30508881102_8384b152a7_b.jpg",
        "https://cdn.squaremeal.co.uk/restaurants/2747/images/waldorf-7_05012024112304.jpg?w=1200&h=800&fit=crop&auto=format%2Ccompress",
      ],
      times: ["12:00 PM", "12:15 PM", "12:30 PM"],
    },

    {
      id: 2,
      name: "The Lagoon - Cinnamon Grand Colombo",
      image: "https://www.cinnamonhotels.com/themes/cinnamon/images/cinnamon_grand_lagoon.jpg",
      bannerImage: "https://media.timeout.com/images/105239239/750/422/image.jpg",
      rating: 4,
      reviews: 95,
      cuisine: ["Seafood", "Sri Lankan", "Asian"],
      category: "Seafood, Sri Lankan - $$$$",
      priceRange: "$$$$",
      description: "Experience the Best Seafood Dining in Colombo",
      about: "The Lagoon at Cinnamon Grand Colombo is renowned for its fresh seafood, offering an exquisite selection of dishes inspired by Sri Lankan and Asian flavors. The ambiance is perfect for seafood lovers looking for a premium dining experience.",
      address: "77 Galle Road, Colombo 03",
      location: "Cinnamon Grand Colombo, Sri Lanka",
      featuredMenu: [
        { name: "Chili Crab", price: "$45", image: "https://www.marionskitchen.com/wp-content/uploads/2023/04/Singapore-Chilli-Crab2.jpg" },
        { name: "Garlic Butter Prawns", price: "$38", image: "https://cafedelites.com/wp-content/uploads/2018/07/Garlic-Butter-Shrimp-IMAGE-46.jpg" },
        { name: "Grilled Lobster", price: "$60", image: "https://www.seriouseats.com/thmb/v3bwZjTg3sL0JzzIzcd5GGpqlwU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230720-GrilledLobster-VickyWasik-8-d52ff009f12b467d8015648d71fa4168.jpg" },
        { name: "Sri Lankan Crab Curry", price: "$50", image: "https://img.delicious.com.au/L0r1xyRs/del/2017/10/sri-lankan-crab-curry-66416-2.jpg" },
        { name: "Tandoori Prawns", price: "$35", image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/tandoori-prawns-recipe.jpg" },
        { name: "Seafood Paella", price: "$42", image: "https://www.simplyrecipes.com/thmb/RlMwlGFPkpTETq4yyYeLtkGnblY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Seafood-Paella-LEAD-09-21aaf7c27fd64c5796c6d19ac7ff4c30.jpg" },
      ],
      photos: [
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/00/c7/59/lagoon-seafood-restaurant.jpg?w=1200&h=-1&s=1",
        "https://www.cinnamonhotels.com/themes/cinnamon/images/cinnamon_grand_lagoon_gallery_2.jpg",
        "https://media-cdn.tripadvisor.com/media/photo-s/11/5c/96/0e/the-lagoon.jpg",
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/6c/3d/d9/the-lagoon.jpg?w=1200&h=-1&s=1",
      ],
      times: ["11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM"],
    },
    
    
  ];
  