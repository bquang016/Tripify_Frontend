// src/pages/Customer/About/Partners.jsx
import React from "react";

const partners = [
    { name: "Vinhomes Ocean Park", logo: "/assets/images/partners/vinhomes.jpg" },
    { name: "InterContinental Hanoi Westlake", logo: "/assets/images/partners/intercontinental.jpg" },
    { name: "Sofitel Legend Metropole Hanoi", logo: "/assets/images/partners/metropole.png" },
    { name: "Flamingo Đại Lải Resort", logo: "/assets/images/partners/flamingo.png" },
    { name: "Vinpearl Resort & Spa", logo: "/assets/images/partners/vinpearl.png" },
    { name: "Hanoi Daewoo Hotel", logo: "/assets/images/partners/daewoo.png" },
    { name: "Mường Thanh Luxury", logo: "/assets/images/partners/muongthanh.png" },
    { name: "FLC Grand Hotel Samson", logo: "/assets/images/partners/flc.jpg" },
    { name: "Novotel Danang Premier", logo: "/assets/images/partners/novotel.png" },
    { name: "Melia Hanoi", logo: "/assets/images/partners/melia.png" },
    { name: "Premier Village Phu Quoc", logo: "/assets/images/partners/premiervillage.jpg" },
    { name: "Pullman Saigon Centre", logo: "/assets/images/partners/pullman.png" },
    { name: "The Reverie Saigon", logo: "/assets/images/partners/reverie.png" },
    { name: "Fusion Maia Da Nang", logo: "/assets/images/partners/fusion.png" },
    { name: "Citadines Marina Halong", logo: "/assets/images/partners/citadines.jpg" },
];

export default function Partners() {
    return (
        <section className="py-20 bg-white text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
                Đối tác khách sạn & chỗ ở
            </h2>

            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-10 gap-y-12 place-items-center">
                {partners.map((partner, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center group hover:scale-110 transition-transform duration-300"
                    >
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-20 w-auto object-contain drop-shadow-md"
                        />
                        <p className="mt-3 text-sm font-medium text-gray-700">
                            {partner.name}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
