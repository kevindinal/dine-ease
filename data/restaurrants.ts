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
    menu: { item: string; price: string }[];
    photos: string[];
    times: string[];
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
      location: "Hilton Colombo, Sri Lanka",
      menu: [
        { item: "Grilled Salmon", price: "$25" },
        { item: "Classic Cheeseburger", price: "$18" },
        { item: "Vegetarian Pasta", price: "$20" },
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
      location: "Kingsbury, Colombo, Sri Lanka",
      menu: [
        { item: "Lobster Thermidor", price: "$40" },
        { item: "Black Angus Steak", price: "$50" },
        { item: "Vegetarian Platter", price: "$22" },
      ],
      photos: [
        "https://thekingsbury.com/uploads/gallery/restaurant1.jpg",
        "https://thekingsbury.com/uploads/gallery/restaurant2.jpg",
        "https://thekingsbury.com/uploads/gallery/restaurant3.jpg",
      ],
      times: ["1:00 PM", "1:30 PM", "2:00 PM"],
    },
  ];
  