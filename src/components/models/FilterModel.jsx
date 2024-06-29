import { Fragment, memo, useEffect, useState } from 'react';
import { formatNumberCounter, transformToCapitalize } from '@/utils';

const areEqual = (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.initialFilterData) === JSON.stringify(nextProps.initialFilterData) &&
        JSON.stringify(prevProps.filterData) === JSON.stringify(nextProps.filterData) &&
        JSON.stringify(prevProps.filterOptions) === JSON.stringify(nextProps.filterOptions)
    );
};

const FilterModel = memo(({ initialFilterData, filterData, functions, filterOptions })=> {

    const [visible, setVisible] = useState(false);

    const [selectedFilter, setSelctedFilter] = useState(initialFilterData);

    const isInitialFilterChange = JSON.stringify(initialFilterData) !== JSON.stringify(selectedFilter) || JSON.stringify(initialFilterData) !== JSON.stringify(filterData);
    const isClearFilter = JSON.stringify(initialFilterData) !== JSON.stringify(filterData);
    const isApplyFilter = JSON.stringify(filterData) !== JSON.stringify(selectedFilter);

    useEffect(() => {

        if (!isInitialFilterChange) {
            setSelctedFilter(initialFilterData);
        } else {
            setSelctedFilter(filterData);
        };

    }, [initialFilterData, filterData]);


    const toggleModel = () => {
        setVisible((prev) => !prev);
    };

    const { setFilter } = functions;

    const sortFilerOptions = [
        {
            filterLabel: 'New to old',
            sort: { dateSort: -1 },
        },
        {
            filterLabel: 'Old to new',
            sort: { dateSort: 1 },
        },
        {

            filterLabel: 'Recent added',
            sort: { dateSort: 'recent added' },
        },
        {
            filterLabel: 'Rating high to low',
            sort: { ratingSort: -1 },
        }
    ];

    const applyFilter = () => {
        if (isApplyFilter) {
            setFilter(selectedFilter);
        };
    };

    const clearFilter = () => {

        if (isClearFilter) {

            setSelctedFilter(initialFilterData);
            setFilter(initialFilterData);
        };
    };

    const addFilter = (newFilterData) => {

        // Check if the new filter is already present in filterData
        const isFilterSelected = Object.entries(newFilterData).every(([key, value]) => selectedFilter[key] === value);

        // If the filter is selected, remove it; otherwise, add it
        if (isFilterSelected) {

            const updatedFilterData = { ...selectedFilter };
            delete updatedFilterData[Object.keys(newFilterData)[0]];

            setSelctedFilter(updatedFilterData);

        } else {

            setSelctedFilter({ ...selectedFilter, ...newFilterData });
        };
    };

    return (
        <>
            {!visible && (
                <div className="w-auto h-auto bg-white fixed bottom-5 right-2 z-10 border border-gray-300 shadow-2xl px-2 flex items-center rounded-2xl select-none">

                    <div onClick={toggleModel} className="text-gray-900 font-semibold flex items-center gap-1 cursor-pointer">
                        <i className="bi bi-filter text-2xl"></i>
                        <span className="text-xs">Filter</span>
                    </div>
                </div>
            )}
            <div className={`w-auto h-auto bg-white fixed bottom-1.5 right-0 transition-all duration-500 ease-in-out z-20 ${visible ? 'translate-y-0' : '-translate-y-[-110%]'} border border-gray-300 shadow-2xl py-1 rounded-md select-none`}>

                <div className="w-full h-auto flex justify-between items-center px-2">
                    <div className="text-sm text-black font-bold">Sort options</div>
                    <button
                        onClick={toggleModel}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex justify-center items-center">
                        <i className="bi bi-x text-xl p-1 cursor-pointer"></i>
                    </button>
                </div>

                <div className="w-56 h-auto pb-2">

                    {sortFilerOptions.map((data, index) => {
                        const isFilterSelected = Object.entries(data.sort).every(([key, value]) => {
                            return selectedFilter[key] === value;
                        });
                        return (
                            <div key={index} onClick={() => addFilter(data.sort)} className="py-1 px-3 flex items-center gap-2 cursor-pointer">
                                <i className={`text-base ${isFilterSelected ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                <div className={`text-xs ${isFilterSelected ? "text-gray-700 font-semibold" : "text-gray-600 font-medium"} transition-all duration-500 ease-in-out`}>
                                    {data.filterLabel}
                                </div>
                            </div>
                        );
                    })}

                    <div className="w-auto h-auto max-h-[300px] overflow-y-scroll scrollbar-hidden">

                        {filterOptions?.map(({ title, data }, index) => (
                            <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    className="sticky top-0  bg-white flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-2 text-gray-800 hover:text-gray-900"
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

                                    {data.genre ? (
                                        <>
                                            <div onClick={() => addFilter({ genre: "all" })} className={`flex justify-between items-center text-xs font-medium ${selectedFilter.genre === "all" ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                {data.totalCount ? (
                                                    <span>All {` (${formatNumberCounter(data.totalCount)})`}</span>

                                                ) : (
                                                    <span>All</span>
                                                )}
                                                <i className={`text-base ${selectedFilter.genre === "all" ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                            </div>

                                            {data.genre?.map(({ filterName, count }) => (

                                                <Fragment key={filterName}>

                                                    <div onClick={() => addFilter({ genre: filterName })} className={`flex justify-between items-center text-xs font-medium ${selectedFilter.genre === filterName ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                        <span>{filterName + ` (${count})`}</span>
                                                        <i className={`text-base ${selectedFilter.genre === filterName ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                    </div>

                                                </Fragment>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {data?.map(({ id, filter, name, count }, index) => (

                                                <Fragment key={!id ? index : id}>

                                                    <div onClick={() => addFilter({ [filter]: name })} className={`flex justify-between items-center text-xs font-medium ${selectedFilter[filter] === name ? "bg-cyan-50 text-cyan-600" : "text-gray-600"} my-1 py-0.5 px-3 cursor-pointer transition-all duration-500 ease-in-out`}>
                                                        {count ? (
                                                            <span>{transformToCapitalize(name) + ` (${count})`}</span>
                                                        ) : (
                                                            <span>{transformToCapitalize(name)}</span>
                                                        )}

                                                        <i className={`text-base ${selectedFilter[filter] === name ? "bi bi-check-circle-fill text-cyan-500" : "bi bi-circle text-gray-300"} transition-all duration-500 ease-in-out`}></i>
                                                    </div>

                                                </Fragment>
                                            ))}
                                        </>
                                    )}

                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {isInitialFilterChange && (
                    <div className="w-full h-auto px-4 py-2 flex justify-between items-center">
                        <button
                            onClick={applyFilter}
                            type="button"
                            className={`w-auto h-auto px-5 py-1.5  ${isApplyFilter ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-400"} text-xs font-medium  rounded-sm`}>Apply</button>

                        <button
                            onClick={clearFilter}
                            type="button"
                            className={`w-auto h-auto px-5 py-1.5 ${isClearFilter ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-400"}  text-xs font-medium rounded-sm`}>Clear</button>

                    </div>
                )}

            </div>
        </>
    )
}, areEqual);

FilterModel.displayName = "FilterModel"

export default FilterModel;