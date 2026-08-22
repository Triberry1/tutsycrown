import { Link } from 'react-router-dom'
import { Category } from '@tutsy-crown/shared'

interface Props {
  category: Category
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      to={`/explore?category=${category.slug}`}
      className="block relative rounded-lg overflow-hidden bg-gray-100 h-40 md:h-56 group"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <p className="text-sm text-gray-200 group-hover:underline">Shop Now →</p>
      </div>
    </Link>
  )
}