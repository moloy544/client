import Link from "next/link"

export default function CategoryGroupSlider() {

  const categoryArray = [
    'New Release',
    'Bollywood',
    'Hollywood',
    'South',
    'Web Series',
    'Hindi Dubbed',
    'Sci-Fi',
    'Comedy',
    'Romance',
    'Animation',
    'Horror',
  ];

  return (
    <div className="w-full h-auto bg-red-100 flex flex-row items-center lg:justify-around overflow-y-scroll whitespace-nowrap gap-3 p-2 mobile:pt-2 mobile:py-0 border border-b-gray-300 scroll-smooth">

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