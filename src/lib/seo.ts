const SITE_URL = "https://nestorhoracio.com";

export const AUTHOR = {
  "@type": "Person" as const,
  name: "Néstor Horacio Díaz",
  url: SITE_URL,
  jobTitle: "Desarrollador web freelance",
  sameAs: ["https://www.facebook.com/nhdigitalspace", "https://www.instagram.com/nh_digital_space/"],
};

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Néstor Horacio Díaz",
    url: SITE_URL,
    author: AUTHOR,
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished,
    author: AUTHOR,
  };
}

export function creativeWorkSchema(opts: { title: string; description: string; url: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    creator: AUTHOR,
  };
}
