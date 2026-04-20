export default function ProductHuntBadge() {
  return (
    <a
      href="https://www.producthunt.com/products/snapmark-3/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-snapmark-3"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Leave a review for Snapmark on Product Hunt"
      className="fixed bottom-28 right-4 z-40 hidden transition-opacity hover:opacity-90 sm:block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/ph-review-badge.svg"
        alt="Snapmark — review on Product Hunt"
        width={250}
        height={54}
        style={{ width: 250, height: 54 }}
      />
    </a>
  );
}
