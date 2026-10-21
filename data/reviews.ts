/**
 * Google reviews shown on the home page.
 *
 * `googleRating` is your overall score — update it now and then from your
 * Google Maps listing. `reviews` are the individual quotes: paste them in
 * exactly as the customer wrote them (you can shorten with "…").
 * While `reviews` is empty, only the rating badge is shown.
 */

export const googleRating = {
  score: 4.9,
  // Opens your Google Maps listing (where customers can read and write reviews).
  url: "https://maps.google.com/?cid=3642871935453773960",
};

export type Review = {
  name: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** e.g. "2 months ago" */
  when?: string;
};

export const reviews: Review[] = [
  // { name: "Customer name", rating: 5, when: "2 months ago", text: "Their review, word for word." },
];
