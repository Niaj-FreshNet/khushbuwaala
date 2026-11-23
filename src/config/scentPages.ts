// Landing pages for a scent family (/scents/woody) or a note (/notes/oud).
// Filtered shop views (?families=woody) are kept out of search engines on purpose; these pages are
// the indexable version, each with its own wording. The ids must match the backend taxonomy
// (src/modules/Discovery/taxonomy.ts). A page whose list has fewer than MIN_PRODUCTS perfumes is
// shown to visitors but not offered to search engines.
import type { ShopListingConfig } from "@/components/Modules/Shop/ShopListing";

export const MIN_PRODUCTS_TO_INDEX = 4;

type ScentCopy = { name: string; heading: string; intro: string; description: string };

export const FAMILY_PAGES: Record<string, ScentCopy> = {
  fresh: {
    name: "Fresh",
    heading: "Fresh perfumes",
    intro: "Clean, airy scents that feel like stepping out of the shower. Easy to wear in Bangladesh's heat, at work or on a long day out.",
    description: "Fresh, clean perfume oils and attars that stay light in hot weather. Compare notes, strength and sizes at Khushbuwaala.",
  },
  citrus: {
    name: "Citrus",
    heading: "Citrus perfumes",
    intro: "Lemon, bergamot and orange give these a bright, lively opening. They wake you up in the morning and sit well in humid weather.",
    description: "Citrus perfume oils with lemon, bergamot and orange. Bright, lively scents for daytime and warm weather.",
  },
  aquatic: {
    name: "Aquatic",
    heading: "Aquatic perfumes",
    intro: "Sea breeze and cool water. Aquatic scents are crisp and uncomplicated, a safe choice when you want to smell clean without being sweet.",
    description: "Aquatic, marine-style perfume oils: cool, crisp and clean. See notes and how long each one lasts.",
  },
  green: {
    name: "Green",
    heading: "Green perfumes",
    intro: "Cut grass, leaves and herbs. Green scents smell natural and calm, somewhere between fresh and earthy.",
    description: "Green perfume oils and attars with grassy, leafy, herbal character. Natural, calm scents from Khushbuwaala.",
  },
  aromatic: {
    name: "Aromatic",
    heading: "Aromatic perfumes",
    intro: "Lavender, sage and fresh herbs, the backbone of many classic men's perfumes. Tidy, confident and good for the office.",
    description: "Aromatic perfume oils built on lavender and herbs. Classic, tidy scents that suit work and everyday wear.",
  },
  floral: {
    name: "Floral",
    heading: "Floral perfumes",
    intro: "Rose, jasmine and white flowers, from soft and powdery to rich and romantic. Many are worn by men too, especially rose with oud.",
    description: "Floral perfume oils and attars: rose, jasmine and white flowers, soft to rich. Filter by note, strength and budget.",
  },
  fruity: {
    name: "Fruity",
    heading: "Fruity perfumes",
    intro: "Apple, berries, peach and tropical fruit. Playful and easy to like, these are often the ones friends ask about.",
    description: "Fruity perfume oils with apple, berries, peach and tropical notes. Cheerful scents that are easy to like.",
  },
  sweet: {
    name: "Sweet",
    heading: "Sweet perfumes",
    intro: "Vanilla, honey and caramel warmth. Sweet scents feel comforting and tend to last; a little goes a long way in the evening.",
    description: "Sweet perfume oils with vanilla, honey and caramel. Warm, comforting scents, many of them long-lasting.",
  },
  gourmand: {
    name: "Gourmand",
    heading: "Gourmand perfumes",
    intro: "Dessert-like scents: chocolate, caramel, vanilla, coffee. Rich and cosy, best in the evening or cooler weather.",
    description: "Gourmand perfume oils that smell of chocolate, caramel, vanilla and coffee. Rich, cosy evening scents.",
  },
  powdery: {
    name: "Powdery",
    heading: "Powdery perfumes",
    intro: "Soft and gentle, like fresh talc or clean linen. Powdery scents stay close and feel neat rather than loud.",
    description: "Powdery perfume oils and attars: soft, gentle and clean. Quiet scents that stay close to the skin.",
  },
  musky: {
    name: "Musky",
    heading: "Musky perfumes",
    intro: "Warm, smooth and skin-like. Musk is the scent that makes people lean in; it also helps other notes last longer.",
    description: "Musky perfume oils and attars: warm, smooth, skin-like scents. White musk to deep black musk at Khushbuwaala.",
  },
  amber: {
    name: "Amber",
    heading: "Amber perfumes",
    intro: "Golden, warm and slightly sweet. Amber gives a perfume depth and a long, comfortable trail on clothes.",
    description: "Amber perfume oils and attars with golden, warm depth. Long-lasting scents for evenings and cooler days.",
  },
  oriental: {
    name: "Oriental",
    heading: "Oriental perfumes",
    intro: "The rich Arabian style: resins, incense, spice and wood. Bold scents with presence, made for occasions.",
    description: "Oriental perfume oils and attars in the Arabian style: resins, incense, spice and wood. Rich scents with presence.",
  },
  spicy: {
    name: "Spicy",
    heading: "Spicy perfumes",
    intro: "Saffron, cardamom, pepper and cinnamon. Spice adds warmth and character, from a gentle glow to something properly bold.",
    description: "Spicy perfume oils with saffron, cardamom, pepper and cinnamon. Warm scents with character.",
  },
  woody: {
    name: "Woody",
    heading: "Woody perfumes",
    intro: "Sandalwood, cedar and oud. Woody scents are steady and grown-up, and they are the base of most long-lasting perfumes.",
    description: "Woody perfume oils and attars with sandalwood, cedar and oud. Deep, steady scents that last.",
  },
  earthy: {
    name: "Earthy",
    heading: "Earthy perfumes",
    intro: "Patchouli, vetiver and the smell of soil after rain. Grounded, calm scents for people who do not want sweetness.",
    description: "Earthy perfume oils and attars with patchouli and vetiver (khus). Grounded, calm, natural scents.",
  },
  smoky: {
    name: "Smoky",
    heading: "Smoky perfumes",
    intro: "Bakhoor smoke, incense and tobacco. Dark and atmospheric, closest to the smell of a majlis in the evening.",
    description: "Smoky perfume oils and attars: bakhoor, incense and tobacco. Dark, atmospheric evening scents.",
  },
  leather: {
    name: "Leather",
    heading: "Leather perfumes",
    intro: "Bold, dark and a little animalic. Leather scents are confident and best when you want to be remembered.",
    description: "Leather perfume oils: bold, dark and confident. See the notes and strength of each at Khushbuwaala.",
  },
};

export const NOTE_PAGES: Record<string, ScentCopy> = {
  oud: {
    name: "Oud",
    heading: "Oud perfumes & attars",
    intro: "Oud (agarwood) is deep, woody and slightly smoky, the heart of Arabian perfumery. These all carry it, from soft blends to full-strength oud oils.",
    description: "Perfume oils and attars with oud (agarwood): deep, woody, smoky. From gentle blends to strong oud oils, in sizes from 3 ml.",
  },
  rose: {
    name: "Rose",
    heading: "Rose perfumes & attars",
    intro: "From fresh, dewy rose to the rich Taif and Turkish kinds. Rose pairs beautifully with oud and musk, and suits men as well as women.",
    description: "Rose perfume oils and attars: fresh rose to rich Taif and Turkish rose, often with oud or musk.",
  },
  musk: {
    name: "Musk",
    heading: "Musk perfumes & attars",
    intro: "Clean white musk, warm amber musk and deep black musk. Soft on the skin and long on clothes.",
    description: "Musk perfume oils and attars: white musk, amber musk and black musk. Soft, warm and long-lasting.",
  },
  amber: {
    name: "Amber",
    heading: "Amber perfumes & attars",
    intro: "Perfumes with a warm, golden amber note that gives depth and a comfortable, lasting trail.",
    description: "Perfume oils and attars with amber: warm, golden and long-lasting.",
  },
  vanilla: {
    name: "Vanilla",
    heading: "Vanilla perfumes",
    intro: "Creamy, sweet vanilla, on its own or wrapped around tobacco, musk and woods. Comforting and easy to love.",
    description: "Vanilla perfume oils: creamy and sweet, alone or with tobacco, musk and woods.",
  },
  sandalwood: {
    name: "Sandalwood",
    heading: "Sandalwood perfumes & attars",
    intro: "Smooth, creamy wood with a calm, almost milky warmth. Sandalwood is gentle, lasting and never loud.",
    description: "Sandalwood perfume oils and attars: smooth, creamy, calm wood. Gentle and long-lasting.",
  },
  jasmine: {
    name: "Jasmine",
    heading: "Jasmine perfumes & attars",
    intro: "Jasmine, including beli, is sweet, heady and unmistakable. A familiar scent here, in a form that lasts all day.",
    description: "Jasmine perfume oils and attars: sweet, heady white flowers that last.",
  },
  saffron: {
    name: "Saffron",
    heading: "Saffron perfumes & attars",
    intro: "Saffron adds a warm, leathery spice that makes a perfume feel rich. It appears in many of the best Arabian blends.",
    description: "Perfume oils and attars with saffron: warm, rich spice in the Arabian style.",
  },
  patchouli: {
    name: "Patchouli",
    heading: "Patchouli perfumes",
    intro: "Earthy, slightly sweet and deep. Patchouli gives a perfume weight and staying power.",
    description: "Perfume oils with patchouli: earthy, deep and long-lasting.",
  },
  vetiver: {
    name: "Vetiver",
    heading: "Vetiver (khus) perfumes & attars",
    intro: "Vetiver, known here as khus, smells of cool roots and wet earth. Calm, green and refreshing in summer.",
    description: "Vetiver (khus) perfume oils and attars: cool, earthy and refreshing, including traditional ruh khus.",
  },
  incense: {
    name: "Incense",
    heading: "Incense & bakhoor perfumes",
    intro: "Frankincense, bakhoor and resin smoke turned into perfume. Warm, spiritual and atmospheric.",
    description: "Perfume oils and attars with incense, frankincense and bakhoor: warm, smoky and atmospheric.",
  },
  lavender: {
    name: "Lavender",
    heading: "Lavender perfumes",
    intro: "Clean, herbal and relaxing. Lavender keeps a perfume tidy and fresh, a classic for office wear.",
    description: "Lavender perfume oils: clean, herbal and calm. Classic scents for everyday and office wear.",
  },
};

export const familyPageConfig = (id: string): ShopListingConfig | null => {
  const copy = FAMILY_PAGES[id];
  if (!copy) return null;
  return {
    basePath: `/scents/${id}`,
    heading: copy.heading,
    intro: copy.intro,
    title: `${copy.heading}: Perfume Oils & Attars in Bangladesh`,
    description: copy.description,
    locked: { families: [id] },
    minProductsToIndex: MIN_PRODUCTS_TO_INDEX,
  };
};

export const notePageConfig = (id: string): ShopListingConfig | null => {
  const copy = NOTE_PAGES[id];
  if (!copy) return null;
  return {
    basePath: `/notes/${id}`,
    heading: copy.heading,
    intro: copy.intro,
    title: `${copy.heading} in Bangladesh`,
    description: copy.description,
    locked: { notes: [id] },
    minProductsToIndex: MIN_PRODUCTS_TO_INDEX,
  };
};
