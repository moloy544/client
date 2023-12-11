import Link from "next/link"

export default function CategoryGroupSlider() {

  const categoryArray = [
    'New Release',
    'Bollywood',
    'Hollywood',
    'Web Series',
    'Hindi Dubbed',
    'SiFy',
    'Comedy',
    'Romance',
    'South',
    'Animation',
    'Horror'
  ]

  return (
    <div className="w-full h-auto bg-white flex flex-row items-center lg:justify-around overflow-y-scroll whitespace-nowrap gap-3 px-2 py-4 mobile:pt-2 mobile:py-0">

      {categoryArray.map((category) => (
        <Link
          key={category}
          href={`/category/${category.toLowerCase().replace(/[' ']/g, '-')}`}
          className="bg-purple-600 w-auto h-auto px-5 py-[10px] mobile:py-2 mobile:px-3 rounded-[4px] text-sm mobile:text-xs font-normal text-white cursor-pointer">
          {category}
        </Link>
      ))}

    </div>
  )
}