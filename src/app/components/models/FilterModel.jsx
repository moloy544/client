import { Fragment, useState } from 'react';
import { formatNumberCounter, transformToCapitalize } from '@/utils';

function FilterModel({ initialFilterData, filterData, filterCounter, functions, extraFilter }) {

    const [visible, setVisible] = useState(false);

    const showModel = () => {
        setVisible(true);
    };

    const hideModel = () => {
        setVisible(false)
    };

    const { setFilter } = functions;

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

    const addFilter = (newFilterData) => {

        if (newFilterData === "clear") {

            setFilter(initialFilterData);

            return;
        };

        // Check if the new filter is already present in filterData
        const isFilterSelected = Object.entries(newFilterData).every(([key, value]) => filterData[key] === value);

        // If the filter is selected, remove it; otherwise, add it
        if (isFilterSelected) {

            const updatedFilterData = { ...filterData };
            delete updatedFilterData[Object.keys(newFilterData)[0]];

            setFilter(updatedFilterData);

        } else {

            setFilter({ ...filterData, ...newFilterData });
        };
    };

    const areFilterIsChange = JSON.stringify(initialFilterData) !== JSON.stringify(filterData);

    return (
        <>

            <div className={`w-auto h-auto bg-white fixed top-20 mobile:top-16 right-2 z-10 border border-gray-300 shadow-2xl ${visible ? "py-1 rounded-md" : "px-2 flex items-center rounded-2xl"} select-none`}>

                {!(visible) ? (

                    <div onClick={showModel} className="text-gray-900 font-semibold flex items-center gap-1 cursor-pointer">
                        <i className="bi bi-filter text-2xl"></i>
                        <span className="text-xs">Filter</span>
                    </div>

                ) : (
                    <>
                        <div className="w-full h-auto flex justify-between items-center px-2">

                            <div className="text-sm text-black font-bold">Sort options {areFilterIsChange && <span onClick={() => addFilter("clear")} className="text-cyan-600 text-[10px] font-medium cursor-pointer">Reset</span>}</div>

                            <i onClick={hideModel} className="bi bi-x text-xl cursor-pointer p-1"></i>
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

                            <div className="w-auto h-auto max-h-[300px] overflow-y-scroll scrollbar-hidden">

                                {/*** Sort By Genre *****/}

                                {initialFilterData.genreSort && (

                                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                            className="sticky top-0 bg-white flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <span className="text-xs font-semibold">Sort by genre</span>

                                            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="w-auto h-auto my-1">

                                            <div onClick={() => addFilter({ genreSort: "all" })} className={`flex justify-between items-center text-xs font-medium ${filterData.genreSort === "all" ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                {filterCounter.genre && filterCounter.totalCount ? (
                                                    <span>All {` (${formatNumberCounter(filterCounter.totalCount)})`}</span>

                                                ) : (
                                                    <span>All</span>
                                                )}
                                                <i className={`text-base ${filterData.genreSort === "all" ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                            </div>

                                            {filterCounter.genre?.map(({ filterName, count }) => (

                                                <Fragment key={filterName}>

                                                    <div onClick={() => addFilter({ genreSort: filterName })} className={`flex justify-between items-center text-xs font-medium ${filterData.genreSort === filterName ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                        <span>{filterName + ` (${count})`}</span>
                                                        <i className={`text-base ${filterData.genreSort === filterName ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                    </div>

                                                </Fragment>
                                            ))}

                                        </div>
                                    </details>
                                )}

                                {extraFilter?.map(({ title, data }, index) => (
                                    <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                                        <summary
                                            className="sticky top-0  bg-white flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <span className="text-xs font-semibold">{title}</span>

                                            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        </summary>

                                        <div className="w-auto h-auto my-1">

                                            {data?.map(({ id, filter, name }) => (

                                                <Fragment key={id}>

                                                    <div onClick={() => addFilter({ [filter]: name })} className={`flex justify-between items-center text-xs font-medium ${filterData[filter] === name ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                        <span>{transformToCapitalize(name)}</span>
                                                        <i className={`text-base ${filterData[filter] === name ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                    </div>

                                                </Fragment>
                                            ))}

                                        </div>
                                    </details>
                                ))}

                            </div>
                        </div>
                    </>
                )}

            </div>
        </>
    )
}

export default FilterModel
