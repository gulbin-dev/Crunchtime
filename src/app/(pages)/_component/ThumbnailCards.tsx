import Image from "next/image";

type ThumbnailCardItem = {
  id: number;
  media_type?: string;
  title?: string;
  poster_path?: string | null;
};

type ThumbnailCardsProps = {
  items: ThumbnailCardItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function ThumbnailCards({
  items,
  selectedIndex,
  onSelect,
}: ThumbnailCardsProps) {
  if (!items.length) return null;

  return (
    <div className="desktop:block absolute right-4 bottom-0 z-30 hidden w-full max-w-110 gap-3">
      <ul className="desktop:flex w-full gap-1.5 overflow-hidden p-3">
        {items.map((item, index) => {
          const imageSrc = item.poster_path
            ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
            : null;

          return (
            <li
              key={item.id}
              className={`relative h-17.75 w-14.75 shrink-0 overflow-hidden rounded-xl shadow-2xl transition-[height,max-width,transform] duration-300 ${selectedIndex === index ? "scale-125" : "scale-100"}`}
            >
              <button
                type="button"
                className="group relative inset-0 h-full w-full cursor-pointer"
                aria-label={`View ${item.title ?? "popular content"}`}
                aria-pressed={selectedIndex === index}
                onClick={() => onSelect(index)}
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={item.title ?? "Popular content thumbnail"}
                    fill
                    sizes="(max-width: 640px) 45vw, 20vw"
                    className="aspect-9/16 rounded-lg object-contain transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="from-cta/70 to-secondary/60 absolute inset-0 bg-linear-to-br" />
                )}
                <span className="text-foreground-light absolute top-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold tracking-[0.24em] uppercase">
                  0{index + 1}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
