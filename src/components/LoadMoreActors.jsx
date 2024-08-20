'use client'

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateLoadActors } from "@/context/loadActorsState/loadActorsSlice";
import BacktoTopButton from "./BacktoTopButton";
import { useInfiniteScroll } from "@/lib/lib";
import { MovieCardSkleaton, ResponsiveActorCard } from "./cards/Cards";

export default function LoadMoreActorsGirdWarper({ apiUrl, industry, initialActors, isDataEnd }) {

    const patname = usePathname();

    const dispatch = useDispatch();

    const { loadActorsPathname, isAllDataLoad, loadActorsData } = useSelector((state) => state.loadActors);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const conditionalData = (loadActorsPathname !== patname) ? (initialActors || []) : loadActorsData || [];
    const [actorsData, setActorsData] = useState(conditionalData);

    const loadMore = useCallback(() =>{
        if (!isAllDataLoad) {
            setPage((prevPage) => prevPage + 1)
        }
        }, [isAllDataLoad]);
        console.log(isAllDataLoad)
        console.log(page)

    // infinite scroll load data custom hook
    const bottomObserverElement = useInfiniteScroll({
        callback: loadMore,
        loading,
        isAllDataLoad,
        rootMargin: '200px'
    });

    useEffect(() => {

        //First component mount store page initial data and current path name in redux store
        if (loadActorsPathname !== patname) {

            dispatch(updateLoadActors({
                loadActorsPathname: patname,
                loadActorsData: initialActors || [],
                isAllDataLoad: isDataEnd || false
            }));
        };

        //Load more actors 
        if (loadActorsPathname === patname && page !== 1 && !loading) {

            const loadMoreData = async () => {

                try {

                    setLoading(true);

                    const response = await axios.post(apiUrl, {
                        industry,
                        skip: actorsData.length,
                        limit: 30
                    });

                    if (response.status === 200) {
                        const { actors, dataIsEnd } = response.data

                        dispatch(updateLoadActors({
                            loadActorsData: [...loadActorsData, ...actors]
                        }));

                        setActorsData((prevData) => [...prevData, ...actors]);

                        if (dataIsEnd) {
                            dispatch(updateLoadActors({ isAllDataLoad: true }));
                        };
                    };

                } catch (error) {
                    console.log(error);
                    dispatch(updateLoadActors({ isAllDataLoad: true }));

                } finally {

                    setLoading(false);
                };
            };

            loadMoreData();
        };

    }, [loadActorsPathname, patname, page, initialActors, isDataEnd, apiUrl, industry]);

    return (
        <>
            <div className="w-full min-h-screen overflow-x-hidden bg-gray-800 pb-2">
                <main className="w-full h-full pt-2">

                    <div className="w-auto h-fit gap-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] px-2 py-2">

                        {actorsData.length > 0 && (
                            actorsData.map((actor, index) => (
                                <ResponsiveActorCard key={actor.imdbId || index} data={actor} />
                            )))}

                        {loading && actorsData.length === 0 && (
                            <MovieCardSkleaton limit={30} />
                        )}

                        {!loading && actorsData.length === 0 && (
                            <div className="my-40 text-gray-400 text-xl mobile:text-base text-center font-semibold">
                                We are not found anything
                            </div>
                        )}
                    </div>

                    {loading && actorsData.length > 0 && (
                        <div className="w-full h-auto mobile:py-6 py-10 flex justify-center items-center">
                            <div className="text-yellow-400 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                >Loading...</span>
                            </div>
                        </div>
                    )}

                    <div className="w-full h-2" ref={bottomObserverElement}></div>
                </main>
            </div>

            <BacktoTopButton postion="mobile:top-20 top-24" />

        </>
    );
};
