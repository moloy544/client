import Link from "next/link"

export default function CategoryGroupSlider() {

  const categoryArray = [
    'New Release',
    'Bollywood',
    'Hollywood',
    'South',
    'Web Series',
    'Hindi Dubbed',
    'Thriller',
    'Action',
    'Romance',
    'Comedy',
    'Horror',
    'Sci-Fi',
    'Animation',
  ];

  return (
    <div className="w-full h-auto bg-red-50 flex flex-row items-center overflow-y-scroll gap-3 mobile:gap-2 whitespace-nowrap pt-4 px-2 border border-b-gray-300 scroll-smooth">

      {categoryArray.map((category) => (
        <Link
          key={category}
          href={`/category/${category.toLowerCase().replace(/[' ']/g, '-')}`}
          className="bg-red-800 w-auto h-auto px-4 py-2 mobile:px-3 rounded-[4px] text-sm mobile:text-xs font-normal text-white cursor-pointer">
          {category}
        </Link>
      ))}

    </div>
  )
}