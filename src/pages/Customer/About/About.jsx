// src/pages/Customer/About/About.jsx

import React from "react";
import AboutSystem from "./AboutSystem";
import Commitments from "./Commitments";
import Partners from "./Partners.jsx";
import Contact from "./Contact.jsx";
import { useTranslation } from "react-i18next";

const About = () => {
    const { t } = useTranslation();
    
    return (
            <main className="w-full bg-gray-50 text-gray-800">
                <section
                    className="relative w-full h-[70vh] flex flex-col items-center justify-center text-center text-white overflow-hidden"
                >

                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/assets/images/about_Tripify.gif')",
                        }}
                    ></div>


                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>

                    {/* ndung */}
                    <div className="relative z-10 px-6 max-w-3xl mx-auto">
                        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
                            {t('about.title')}
                        </h1>
                        <p className="text-lg leading-relaxed drop-shadow-md">
                            {t('about.subtitle')}
                        </p>
                    </div>
                </section>

                {/* Các phần nội dung của trang About */}
                <AboutSystem />
                <Partners />
                <Commitments />
                <Contact /> 
                {/* ID "contact" vẫn ở đây để link hoạt động */}
            </main>
    );
};

export default About;
