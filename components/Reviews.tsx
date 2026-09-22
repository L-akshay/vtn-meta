"use client";
import { useRef } from "react";
import { Star } from "./icons";
import { Marquee } from "./ui/marquee";
import { reviews, type Review } from "@/lib/reviews";

function ReviewCard({ review }: { review: Review }) {
  return <figure className="review">
    <div className="review-stars" role="img" aria-label={`${review.stars} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} strokeWidth={0} fill={i < review.stars ? "currentColor" : "#d2d2d7"} aria-hidden="true" />)}</div>
    <blockquote><p>{review.text}</p></blockquote>
    <figcaption>{review.name}<span>{review.platform}</span></figcaption>
  </figure>;
}

/** Two counter-moving rows of real store reviews. Touch pauses the movement. */
export function Reviews() {
  const scope = useRef<HTMLElement>(null);
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)];
  const pause = (on: boolean) => scope.current?.classList.toggle("is-touching", on);
  return <section ref={scope} className="reviews" aria-labelledby="reviews-heading"
    onPointerDown={() => pause(true)} onPointerUp={() => pause(false)} onPointerCancel={() => pause(false)} onPointerLeave={() => pause(false)}>
    <div className="container"><h2 id="reviews-heading">From the App Store</h2></div>
    <Marquee pauseOnHover className="reviews-row" tabIndex={0} role="region" aria-label="Reviews, first row">{rows[0].map(review => <ReviewCard key={review.name} review={review} />)}</Marquee>
    <Marquee pauseOnHover reverse className="reviews-row" tabIndex={0} role="region" aria-label="Reviews, second row">{rows[1].map(review => <ReviewCard key={review.name} review={review} />)}</Marquee>
  </section>;
}
