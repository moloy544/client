import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { formatNumberCounter } from '@/utils';
import { updateLoadMovies } from '@/context/loadMoviesState/loadMoviesSlice';

function FilterModel({ initialFilterData, filterData, filterCounter, functions }) {
    
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();

    const showModel = () => {
        setVisible(true);
    };

    const hideModel = () => {
        setVisible(false)
    };

    const { resetData } = functions;

    const sortFilerOptions = [
        {
            filterLabel: 'Date new to old',
            sort: { dateSort: -1 },
        },
        {
            filterLabel: 'Date old to new',
            sort: { dateSort: 1 },
        },
        {
            filterLabel: 'Rating high to low',
            sort: { ratingSort: -1 },
        },
    ];

    const categoryFilterOptions = [
            {
                id: 1,
                filter: 'categoryFilter',
                name: "new release"
            },
            {
                id: 2,
                filter: 'categoryFilter',
                name: "hollywood"
            },

            {
                id: 3,
                filter: 'categoryFilter',
                name: "bollywood"
            },
            {
                id: 4,
                filter: 'categoryFilter',
                name: "south"
            },
            {
                id: 5,
                filter: 'typeFilter',
                name: "series"
            },
            {
                id: 6,
                filter: 'typeFilter',
                name: "movie"
            },
            {
                id: 7,
                filter: 'languageFilter',
                name: "hindi"
            },
            {
                id: 8,
                filter: 'languageFilter',
                name: "hindi dubbed"
            },
            {
                id: 9,
                filter: 'languageFilter',
                name: "bengali"
            }
        ];

    const addFilter = (newFilterData) => {

        resetData();

        if (newFilterData === "clear") {

            dispatch(updateLoadMovies({
                loadMoviesData: [],
                filterData: updatedFilterData,
                isAllDataLoad: false
            }));

            return;
        };

        // Check if the new filter is already present in filterData
        const isFilterSelected = Object.entries(newFilterData).every(([key, value]) => filterData[key] === value);

        // If the filter is selected, remove it; otherwise, add it
        if (isFilterSelected) {
            const updatedFilterData = { ...filterData };
            delete updatedFilterData[Object.keys(newFilterData)[0]]; // Assuming each newFilterData object has only one key
            dispatch(updateLoadMovies({
                loadMoviesData: [],
                filterData: updatedFilterData,
                isAllDataLoad: false
            }));
        } else {
            dispatch(updateLoadMovies({
                loadMoviesData: [],
                filterData: {
                    ...filterData,
                    ...newFilterData
                },
                isAllDataLoad: false
            }));
        };
    };

    return (

        <div className={`w-auto h-auto bg-white fixed top-20 mobile:top-16 right-5 z-20 border border-gray-300 shadow-2xl ${visible ? "py-1 rounded-md" : "px-2 flex items-center rounded-2xl"} select-none`}>

            {!(visible) ? (

                <div onClick={showModel} className="text-gray-900 font-semibold flex items-center gap-1 cursor-pointer">
                    <i className="bi bi-filter text-2xl"></i>
                    <span className="text-xs">Filter</span>
                </div>

            ) : (
                <>
                    <div className="w-full h-auto flex justify-between items-center px-2">

                        <div className="text-sm text-black font-bold">Sort options</div>

                        <i onClick={hideModel} className="bi bi-x text-xl cursor-pointer"></i>
                    </div>

                    <div className="w-56 h-auto">

                        {sortFilerOptions.map((data, index) => {
                            const isFilterSelected = Object.entries(data.sort).every(([key, value]) => {
                                return filterData[key] === value;
                            });
                            return (
                                <div key={index} onClick={() => addFilter(data.sort)} className="py-1 px-3 flex items-center gap-2 cursor-pointer">
                                    <i className={`text-base ${isFilterSelected ? "bi bi-check-circle-fill text-red-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                    <div className={`text-xs ${isFilterSelected ? "text-gray-700 font-semibold" : "text-gray-600 font-medium"} transition-all duration-500 ease-in-out`}>
                                        {data.filterLabel}
                                    </div>
                                </div>
                            );
                        })}

                        {/*** Sort By Genre *****/}

                        {initialFilterData.genreSort && (
                            <div className="w-auto h-auto my-1">

                                <>
                                    <div className=" px-2 text-gray-800 text-sm font-bold py-1">
                                        Filter by genre
                                    </div>

                                    <div className="w-auto h-auto max-h-60 overflow-y-scroll scrollbar-hidden">

                                        <div onClick={() => addFilter({ genreSort: "all" })} className={`flex justify-between items-center text-xs font-medium ${filterData.genreSort === "all" ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                            {filterCounter.genre && filterCounter.totalCount ? (
                                                <span>All {` (${formatNumberCounter(filterCounter.totalCount)})`}</span>

                                            ) : (
                                                <span>All</span>
                                            )}
                                            <i className={`text-base ${filterData.genreSort === "all" ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                        </div>

                                        {filterCounter.genre?.map(({ filterName, count }) => (

                                            <React.Fragment key={filterName}>

                                                <div onClick={() => addFilter({ genreSort: filterName })} className={`flex justify-between items-center text-xs font-medium ${filterData.genreSort === filterName ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                    <span>{filterName + ` (${count})`}</span>
                                                    <i className={`text-base ${filterData.genreSort === filterName ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                </div>

                                            </React.Fragment>
                                        ))}

                                    </div>
                                </>

                            </div>
                        )}

                        {/**** Filter by category, type, language and more *********/}

                        {initialFilterData.categoryFilter && (
                            <div className="w-auto h-auto my-1">

                                <>
                                    <div className=" px-2 text-gray-800 text-sm font-bold py-1">
                                    Filter by category
                                    </div>

                                    <div className="w-auto h-auto max-h-60 overflow-y-scroll scrollbar-hidden">

                                        <div onClick={() => addFilter({ categoryFilter: "all" })} className={`flex justify-between items-center text-xs font-medium ${filterData.genreSort === "all" ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>

                                            <span>All</span>

                                            <i className={`text-base ${filterData.categoryFilter === "all" ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                        </div>

                                        {categoryFilterOptions.map(({ id, filter, name }) => (

                                            <React.Fragment key={id}>

                                                <div onClick={() => addFilter({ [filter]: name })} className={`flex justify-between items-center text-xs font-medium ${filterData[filter] === name ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                    <span>{name}</span>
                                                    <i className={`text-base ${filterData[filter] === name ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                </div>

                                            </React.Fragment>

                                        ))}

                                    </div>
                                </>

                            </div>
                        )}

                    </div>
                </>
            )}

        </div>
    )
}

export default FilterModel
