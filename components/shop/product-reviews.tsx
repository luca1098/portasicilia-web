import type { Review } from '@/lib/schemas/entities/experience.entity.schema'
import ReviewSection from '@/components/review/review-section'

type ProductReviewsProps = {
  reviews: Review[]
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  return <ReviewSection reviews={reviews} listingType="product" />
}
