import { memo, useEffect, useState } from 'react';
import { formatNumberCounter, transformToCapitalize } from '@/utils';

const areEqual = (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.initialFilterData) === JSON.stringify(nextProps.initialFilterData) &&
        JSON.stringify(prevProps.filterData) === JSON.stringify(nextProps.filterData) &&
        JSON.stringify(prevProps.filterOptions) === JSON.stringify(nextProps.filterOptions)
    );
};

const FilterModel = memo(({ initialFilterData, filterData, functions, filterOptions }) => {

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
            sort: { createdAt: -1 },
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

    // Counting filters that differ from initialFilterData
    const countChangedFilters = Object.keys(filterData).filter(key => filterData[key] !== initialFilterData[key]).length;

    return (
  <>
    {!visible && (
      <div className="w-auto h-auto bg-gray-800 fixed bottom-5 right-2 z-10 border border-gray-700 shadow-2xl px-3 py-1 flex items-center rounded-2xl select-none">

        <div onClick={toggleModel} className="text-gray-100 font-semibold flex items-center gap-1 cursor-pointer">
          <i className="bi bi-filter text-xl md:text-2xl"></i>
          <span className="text-xs md:text-sm">Filter</span>
        </div>

        {countChangedFilters !== 0 && (
          <div className="absolute top-[-8px] left-[-2px] bg-red-600 rounded-xl py-0.5 px-1.5 text-xs font-semibold text-white">
            {countChangedFilters}
          </div>
        )}
      </div>
    )}

    <div className={`fixed bottom-2 right-2 z-[100] transition-all duration-500 ease-in-out border border-gray-700 shadow-2xl rounded-lg 
      ${visible ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'} 
      bg-gray-800 text-gray-100 w-full max-w-xs max-h-[80vh] overflow-y-auto overflow-x-hidden select-none`}>

      <div className="w-full flex justify-between items-center px-3 py-2 border-b border-gray-700 sticky top-0 z-10 bg-gray-800 bg-opacity-90">
        <div className="text-sm font-bold">Filter options</div>
        <button onClick={toggleModel} className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full flex items-center justify-center">
          <i className="bi bi-x text-base"></i>
        </button>
      </div>

      <div className="pb-3">
        {sortFilerOptions.map((data, index) => {
          const isFilterSelected = Object.entries(data.sort).every(([key, value]) => selectedFilter[key] === value);
          return (
            <div key={index} onClick={() => addFilter(data.sort)} className="py-1.5 px-4 flex items-center gap-2 cursor-pointer hover:bg-gray-900">
              <i className={`text-base ${isFilterSelected ? "bi bi-check-circle-fill text-cyan-400" : "bi bi-circle text-gray-500"} transition-all duration-300`}></i>
              <div className={`text-xs ${isFilterSelected ? "text-white font-semibold" : "text-gray-300"}`}>
                {data.filterLabel}
              </div>
            </div>
          );
        })}

        <div className="px-2">
          {filterOptions?.map(({ title, data }, index) => (
            <details key={index} className="group [&_summary::-webkit-details-marker]:hidden mb-2">
              <summary className="flex items-center justify-between px-2.5 py-2 cursor-pointer text-sm font-medium text-gray-300 bg-gray-700 rounded-md">
                <span>{title}</span>
                <span className="shrink-0 transition-transform duration-300 group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>

              <div className="my-1">
                {data?.map(({ id, filter, name, count }, subIndex) => {
                  const selected = selectedFilter[filter] === name;
                  return (
                    <div
                      key={id || subIndex}
                      onClick={() => addFilter({ [filter]: name })}
                      className={`flex justify-between items-center px-3 py-1 text-xs font-medium cursor-pointer
                        ${selected ? "bg-cyan-800 text-cyan-100" : "text-gray-300 hover:bg-gray-700"}
                        transition-all duration-300 rounded-sm`}>
                      <span>{transformToCapitalize(name)} {count ? `(${formatNumberCounter(count)})` : ''}</span>
                      <i className={`text-base ${selected ? "bi bi-check-circle-fill text-cyan-400" : "bi bi-circle text-gray-500"}`}></i>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>

      {isInitialFilterChange && (
        <div className="w-full px-4 py-3 border-t border-gray-800 bg-gray-900 bg-opacity-30 flex justify-between items-center sticky bottom-0 z-10">
          <button
            onClick={applyFilter}
            className={`px-4 py-1.5 text-xs font-medium rounded-md 
            ${isApplyFilter ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
            Apply
          </button>
          <button
            onClick={clearFilter}
            className={`px-4 py-1.5 text-xs font-medium rounded-md 
            ${isClearFilter ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
            Clear
          </button>
        </div>
      )}
    </div>
  </>
);

}, areEqual);

FilterModel.displayName = 'FilterModel';

export default FilterModel;
