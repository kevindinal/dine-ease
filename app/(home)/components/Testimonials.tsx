
"use client";

//import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Food Enthusiast",
        comment: "The AR menu experience was mind-blowing! I could see exactly what my dish would look like before ordering.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Tech Reviewer",
        comment: "DineEase has revolutionized how I discover and book restaurants. The AI recommendations are spot-on!",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
    {
        id: 3,
        name: "Emma Wilson",
        role: "Food Blogger",
        comment: "The seamless booking experience and personalized suggestions make DineEase my go-to platform for dining.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
];

const Testimonials =() => {
    const [currentIndex, setCurretnIndex] = useState(0);

    const nextTestimonial = () => {
        setCurretnIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurretnIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-accent-dark mb-12 text-center">
                    What our Customers Say
                </h2>
                <div className="relative max-w-4xl mx-auto">
                    <div className="flex items-center justify-center">
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 z-10 bg-white shadow-lg rounded-full"
                            onClick={prevTestimonial}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button> */}

                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial.id}
                                        className="min-w-full px-4"
                                    >
                                        <div className="bg-primary-softer rounded-2xl p-8 relative">
                                            <Quote className="absolute top-4 right-4 h-12 w-12 text-primary opacity-20" />
                                            <div className="flex flex-col items-center text-center">
                                                <img 
                                                    src={testimonial.image} 
                                                    alt={testimonial.name}
                                                    className="w-20 h-20 rounded-full object-cover mb-4" 
                                                />
                                                <p className="text-lg text-accent-darker mb-6 italic">
                                                    "{testimonial.comment}"
                                                </p>
                                                <h4 className="font-semibold text-accent-dark">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 z-10 bg-white shadow-lg rounded-full"
                            onClick={nextTestimonial}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
