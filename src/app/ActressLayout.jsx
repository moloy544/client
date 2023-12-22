'use client'

import { appConfig } from '@/config/config';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import LazyLoadingImage from './components/LazyLoadingImage';

const apiUrl = `${appConfig.backendUrl}/api/v1/landing_page?offset=2`;

const loaderSkleatons = () => {
    return (

        <div className="w-full h-auto flex flex-row overflow-x-scroll overflow-y-hidden whitespace-nowrap gap-4 px-2">

            {Array.from({ length: 15 }, (_, index) => (
                <div key={index} className="bg-gray-300 w-28 h-[150px] px-3 py-2 rounded-md movies_card_pre-loader flex-none">
                </div>
            ))}
        </div>
    )
};

const ActressWarper = ({ topActressData }) => {

    return (
        <section className="w-full h-fit">
            <h1 className="text-xl mobile:text-sm text-gray-200 text-center mx-2 my-2 font-semibold">
                Top Actress
            </h1>

            <div className="w-full h-fit flex flex-row overflow-x-scroll overflow-y-hidden whitespace-nowrap gap-4 px-2 py-3">
                {topActressData.map((cast) => (
                    <div key={cast._id} className="w-auto h-auto px-3 py-1.5 cursor-pointer bg-pink-200 rounded-md">
                        <div className="w-24 h-24 mobile:w-20 mobile:h-20 rounded-full border-2 border-red-500">
                            <LazyLoadingImage
                                className="w-full h-full object-fill pointer-events-none select-none rounded-full"
                                actualSrc={cast.avatar}
                                alt={cast.name}
                            />
                        </div>
                        <div className="w-24 h-auto mobile:w-20 text-gray-900 overflow-hidden py-1">
                            <p style={{ lineHeight: '15px' }} className="whitespace-normal text-xs font-semibold font-sans text-center">
                                {cast.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const ActressLayout = () => {

    const [isVisible, setIsVisible] = useState(false);
    const [topActressData, setTopActressData] = useState([]);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiUrl); // Replace with your API endpoint
                const { topActressData } = response.data;
                setTopActressData(topActressData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                        fetchData(); // Fetch data when component is visible
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the component is visible
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    return (
        <div ref={componentRef}>
            {isVisible && <ActressWarper topActressData={topActressData} />}
            {loading && loaderSkleatons()}
        </div>
    );
};

export default ActressLayout;
