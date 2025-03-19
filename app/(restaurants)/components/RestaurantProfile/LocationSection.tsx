type LocationSectionProps = {
  address: string;
  location: string; // Add this line
};

export default function LocationSection({ address, location }: LocationSectionProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <iframe 
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} 
          className="w-full h-64 rounded-lg">
        </iframe>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Location</h3>
        <p>{address}</p>
        <p>{location}</p> {/* Display the location here */}
        <p>Contact: +94 77 123 4567</p>
      </div>
    </div>
  );
}