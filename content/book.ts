/**
 * The printed book — catalogue data. Facts as published on gangatiram.in.
 */
export const bookHeading = ["The Book", "Hold all 2,525 kilometres in your hands"];

export const bookBlurb =
  "Not a photo album — a pilgrimage. The author walks her whole length, Gomukh to Gangasagar, and tells the journey place by place: the people met, the festivals stumbled into, the stories the river gave up along the way — carried by 240 photographs of 75 places.";

export const bookPrice = "₹999";
export const bookShippingNote = "free shipping pan-India · direct UPI · tracking in 24 hours";
export const bookBuyHref = "/buy";

export const bookViews = [
  { label: "Front", src: "/book/front.jpg" },
  { label: "Spine", src: "/book/spine.jpg" },
  { label: "Back", src: "/book/back.jpg" },
] as const;

export const bookSpecs = [
  { label: "What it is", value: "A pilgrimage travelogue — journey, stories, photographs" },
  { label: "Pages", value: "300" },
  { label: "Photographs", value: "240" },
  { label: "Places", value: "75, in river order" },
  { label: "Route", value: "Gomukh → Gangasagar, 2,525 km" },
  { label: "Payment", value: "Direct UPI" },
  { label: "Delivery", value: "Pan-India · tracking in 24 hours" },
] as const;

export const bookMissionLine =
  "Every copy carries the mission — each order helps fund ghat cleanups and keeps weaver looms running.";
