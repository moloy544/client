import Link from "next/link"

export default function CategoryGroupSlider() {

  const categoryArray = [
    {
      id: 1,
      name: "Hollywood"
    },

    {
      id: 2,
      name: "Bollywood"
    },
    {
      id: 3,
      name: "South"
    },
    {
      id: 4,
      name: "Hindi"
    },
    {
      id: 5,
      name: "Hindi Dubbed"
    },
    {
      id: 28,
      name: "Action"
    },
    {
      id: 12,
      name: "Adventure"
    },
    {
      id: 16,
      name: "Animation"
    },
    {
      id: 35,
      name: "Comedy"
    },
    {
      id: 80,
      name: "Crime"
    },
    {
      id: 99,
      name: "Documentary"
    },
    {
      id: 18,
      name: "Drama"
    },
    {
      id: 10751,
      name: "Family"
    },
    {
      id: 14,
      name: "Fantasy"
    },
    {
      id: 36,
      name: "History"
    },
    {
      id: 27,
      name: "Horror"
    },
    {
      id: 10402,
      name: "Music"
    },
    {
      id: 9648,
      name: "Mystery"
    },
    {
      id: 10749,
      name: "Romance"
    },
    {
      id: 878,
      name: "Science Fiction"
    },
    {
      id: 53,
      name: "Thriller"
    },
    {
      id: 10752,
      name: "War"
    }
  ];

  return (

    <div className="w-auto h-auto bg-white flex flex-row items-center overflow-y-scroll gap-3 mobile:gap-2 whitespace-nowrap pt-4 px-2 border border-t-transparent border-b-gray-300 scroll-smooth">

      {categoryArray.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.name.toLowerCase().replace(/[' ']/g, '-')}`}
          className="bg-red-800 w-auto h-auto px-4 py-2 mobile:px-3 rounded-[4px]">
          <span className="w-auto h-auto text-sm mobile:text-xs font-normal text-white">{category.name}</span>
        </Link>
      ))}

    </div>

  )
}