type MenuItem = {
    name: string;
    price: string;
    image: string;
  };
  
  type FeaturedMenuProps = {
    featuredMenu: MenuItem[];
  };
  
  export default function FeaturedMenu({ featuredMenu }: FeaturedMenuProps) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMenu.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="mt-2 font-semibold text-gray-800">{item.name}</h3>
              <p className="text-red-500 font-semibold">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }