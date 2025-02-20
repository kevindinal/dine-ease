export type Restaurant = {
    id: number;
    name: string;
    image: string;
    bannerImage: string;
    rating: number;
    reviews: number;
    cuisine: string;
    category: string;
    priceRange: string;
    location: string;
    featuredMenu: { name: string; price: string; image: string }[]; // Updated key
    photos: string[];
    times: string[];
    address: string;
    description: string;
  };
  
  export const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Hilton Colombo",
      image: "https://hiltoncolombo1.com/uploads/poster/6881610003007Cover1.jpg",
      bannerImage: "https://resizer.otstatic.com/v2/photos/wide-xlarge/2/41686450.jpg",
      rating: 5,
      reviews: 120,
      cuisine: "International",
      category: "Global, International - $$$",
      priceRange: "$$$",
      description: "Hi I'm Kevin!",
      address: "279/6 Hospital Road",
      location: "Hilton Colombo, Sri Lanka",
      featuredMenu: [
        { name: "Grilled Salmon", price: "$32", image: "https://example.com/salmon.jpg" },
        { name: "Pan-Seared Duck", price: "$38", image: "https://example.com/duck.jpg" },
        { name: "Truffle Pasta", price: "$28", image: "https://example.com/pasta.jpg" },
      ],
      photos: [
        "https://hiltoncolombo1.com/resturant-gallery/6271610003271G3-1.jpg",
        "https://www.hilton.com/im/en/COLHITW/15076023/lab.jpg?impolicy=crop&cw=5362&ch=4171&gravity=NorthWest&xposition=443&yposition=0&rw=684&rh=532",
        "https://bmkltsly13vb.compat.objectstorage.ap-mumbai-1.oraclecloud.com/cdn.dailymirror.lk/assets/uploads/image_a9ff965e05.jpg",
      ],
      times: ["12:00 PM", "12:15 PM", "12:30 PM"],
    },
    {
      id: 2,
      name: "The Kingsbury",
      image: "https://thekingsbury.com/uploads/banner/kingsbury.jpg",
      bannerImage: "https://thekingsbury.com/uploads/banner/kingsbury-hotel.jpg",
      rating: 4,
      reviews: 95,
      cuisine: "Sri Lankan, Continental",
      category: "Fine Dining - $$$$",
      priceRange: "$$$$",
      description: "Hi I'm Kevin!",
      address: "279/6 Hospital Road",
      location: "Kingsbury, Colombo, Sri Lanka",
      featuredMenu: [
        { name: "Lobster Thermidor", price: "$40", image: "https://example.com/lobster.jpg" },
        { name: "Black Angus Steak", price: "$50", image: "https://example.com/steak.jpg" },
        { name: "Vegetarian Platter", price: "$22", image: "https://example.com/veggie.jpg" },
      ],
      photos: [
        "https://thekingsbury.com/uploads/gallery/restaurant1.jpg",
        "https://thekingsbury.com/uploads/gallery/restaurant2.jpg",
        "https://thekingsbury.com/uploads/gallery/restaurant3.jpg",
      ],
      times: ["1:00 PM", "1:30 PM", "2:00 PM"],
    },
  ];
  