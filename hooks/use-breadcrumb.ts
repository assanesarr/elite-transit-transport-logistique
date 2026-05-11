import { usePathname } from "next/navigation";

export const useBreadcrumb = () => {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);

  const breadcrumb = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    return {
      label: formatLabel(seg),
      href,
    };
  });

  return breadcrumb;
};

const formatLabel = (segment: string) => {
  // remplace tirets et underscores
  const cleaned = segment.replace(/[-_]/g, " ");

  // capitalise chaque mot
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
};