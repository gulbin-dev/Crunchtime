import LoaderCardPoster from "./LoaderCardPoster";

export default function InitialLoaderCardPoster() {
  const li = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return li.map((item) => (
    <li key={item}>
      <LoaderCardPoster />
    </li>
  ));
}
