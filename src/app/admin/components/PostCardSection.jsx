function PostCardSection({ blogData }) {

    return (
        <div className="w-full h-full bg-white px-2 py-5">
            <div className="my-5 w-full h-full grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2 px-2">

                {blogData.map((data) => (
                    <div
                        key={data.id}
                        className="w-auto max-w-[220px] h-72 bg-white hover:shadow-xl shadow-md border border-gray-300 rounded-sm px-3 relative"
                    >
                        <div className="w-fit h-44">
                            <img
                                className="w-full h-full object-cover"
                                src={data.image_url}
                                alt={data.title}
                            />
                        </div>

                        <div className="my-1">
                            <div className="text-sm text-gray-900 font-semibold">
                                Title: {data.title}
                            </div>
                            <div className="text-xs text-gray-900 font-semibold line-clamp-4">
                                Blog: {data.content}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostCardSection;