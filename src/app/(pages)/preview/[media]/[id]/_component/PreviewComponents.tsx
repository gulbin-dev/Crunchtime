import { useParams } from "next/navigation";
import usePreview from "@//hooks/usePreviewDetails";
import Image from "next/image";
import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import { normalizePreviewData } from "@utils/normalizeData";

export function Cast() {
  const params = useParams();
  const { data } = usePreview(params.media, params.id, { suspense: true });
  return data?.credits?.cast?.map((cast) => (
    <li key={cast.id} className="flex w-40 shrink-0 items-center gap-2 py-2">
      {cast.profile_path === null ? (
        <div className="h-18.75 w-12.5 shrink-0">
          <CardPosterImagePlaceholder />
        </div>
      ) : (
        <Image
          src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`}
          alt={cast.name}
          width={100}
          height={100}
          className="h-18.75 w-12.5 shrink-0 rounded object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col">
        <span className="font-semibold wrap-break-word">{cast.name}</span>
        <span className="wrap-break-word">{cast.character}</span>
      </div>
    </li>
  ));
}

export function Crew() {
  const params = useParams();
  const { data } = usePreview(params.media, params.id, { suspense: true });
  return data?.credits?.crew?.map((crew) => (
    <li
      key={crew.credit_id}
      className="flex w-40 shrink-0 items-center gap-2 py-2"
    >
      {crew.profile_path === null ? (
        <div className="h-18.75 w-12.5 shrink-0">
          <CardPosterImagePlaceholder />
        </div>
      ) : (
        <Image
          src={`https://image.tmdb.org/t/p/w185/${crew.profile_path}`}
          alt={crew.name}
          width={100}
          height={100}
          className="h-18.75 w-12.5 shrink-0 rounded object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col">
        <span className="font-semibold wrap-break-word">{crew.name}</span>
        <span className="wrap-break-word">{crew.known_for_department}</span>
      </div>
    </li>
  ));
}

export function Similar() {
  const params = useParams();
  const { data } = usePreview(params.media, params.id, { suspense: true });
  const normalize = data && normalizePreviewData(data);
  if (normalize === undefined) return null;
  return normalize?.similar?.results?.map((item) => {
    const title = "name" in item ? item.name : item.title;
    return (
      <li key={item.id} className="flex w-40 shrink-0 items-center gap-2 py-2">
        {item.poster_path === null ? (
          <div className="h-18.75 w-12.5 shrink-0">
            <CardPosterImagePlaceholder />
          </div>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/w185/${item.poster_path}`}
            alt={title || "Poster"}
            width={100}
            height={100}
            className="h-18.75 w-12.5 shrink-0 rounded object-cover"
          />
        )}
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold wrap-break-word">
            {title || "No title"}
          </span>
          <span className="wrap-break-word">{item.popularity}</span>
        </div>
      </li>
    );
  });
}

export function Recommendation() {
  const params = useParams();
  const { data } = usePreview(params.media, params.id, { suspense: true });
  const normalize = data && normalizePreviewData(data);
  if (normalize === undefined) return null;
  return normalize?.recommendations?.results?.map((item) => {
    const title = "name" in item ? item.name : item.title;
    return (
      <li key={item.id} className="flex w-40 shrink-0 items-center gap-2 py-2">
        {item.poster_path === null ? (
          <div className="h-18.75 w-12.5 shrink-0">
            <CardPosterImagePlaceholder />
          </div>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/w185/${item.poster_path}`}
            alt={title || "Poster"}
            width={100}
            height={100}
            className="h-18.75 w-12.5 shrink-0 rounded object-cover"
          />
        )}
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold wrap-break-word">
            {title || "No title"}
          </span>
          <span className="wrap-break-word">{item.popularity}</span>
        </div>
      </li>
    );
  });
}
