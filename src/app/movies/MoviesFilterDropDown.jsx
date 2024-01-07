function MoviesFilterDropDown({ filterData }) {

    return (
        <div className="space-y-2 fixed top-[70px] right-4 z-50">
            <details
                className="overflow-hidden rounded-sm border border-gray-300 [&_summary::-webkit-details-marker]:hidden shadow-xl"
            >
                <summary
                    className="flex cursor-pointer items-center justify-between gap-2 bg-white p-2 text-gray-900 transition"
                >
                    <span className="text-sm font-medium">Filter</span>

                    <span className="transition group-open:-rotate-180">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </summary>

                <div className="border-t border-gray-200 bg-white">

                    <ul className="space-y-1 border-t border-gray-200 p-4 max-h-[400px] overflow-y-auto">

                        <li>
                            <div>
                                <input
                                    type="radio"
                                    name="filter"
                                    value="All"
                                    id="all-genre"
                                    className="peer hidden"
                                />

                                <label htmlFor="all-genre"
                                    className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white p-1 text-gray-900 hover:border-gray-200 peer-checked:border-yellow-600 peer-checked:bg-yellow-600 peer-checked:text-white  hover:bg-gray-100"
                                >
                                    <p className="text-sm font-medium">All</p>
                                </label>
                            </div>
                        </li>

                        {filterData.map((data) => (

                            <li key={data.id}>
                                <div className="py-2">
                                    <input
                                        type="radio"
                                        name="filter"
                                        value={data.name}
                                        id={data.name}
                                        className="peer hidden"
                                    />

                                    <label
                                        htmlFor={data.name}
                                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white p-1 text-gray-900 hover:border-gray-200 peer-checked:border-yellow-600 peer-checked:bg-yellow-600 peer-checked:text-white  hover:bg-gray-100"
                                    >
                                        <p className="text-sm font-medium">{data.name}</p>
                                    </label>
                                </div>
                            </li>
                        ))}

                    </ul>
                </div>
            </details>


        </div>
    )
}

export default MoviesFilterDropDown
