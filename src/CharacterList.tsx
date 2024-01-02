import match from "autosuggest-highlight/match";
import { Character } from "./interfaces";
import { getCharacters } from "./service/api";
import parse from "autosuggest-highlight/parse";
import { useSelection } from "./store";
import { useInfiniteQuery } from "@tanstack/react-query";

export function CharacterResult(props: { inputValue: string }) {
  const query = useInfiniteQuery({
    queryKey: ["characters", props.inputValue],
    initialPageParam: "0",
    queryFn: async ({ pageParam }) =>
      await getCharacters({ name: props.inputValue, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { searchParams } = new URL(lastPage.info.next ?? "");
      return searchParams.get("page");
    },
  });
  if (query.isError) {
    return <span>{query.error.message}</span>;
  }
  if (query.isLoading) {
    return <span>Loading...</span>;
  }
  if (query.isPending) {
    return <span>Pending...</span>;
  }
  const { fetchNextPage, data, hasNextPage } = query;
  const results = data.pages.flatMap((page) => page.results);
  return (
    <>
      <CharacterList characters={results} {...props} />
      {hasNextPage ? (
        <button onClick={() => fetchNextPage()}>load more</button>
      ) : (
        <span style={{ fontSize: "12px", opacity: 0.6 }}>
          <i>end of list</i>
        </span>
      )}
    </>
  );
}
function CharacterItem(props: Character & { highlight?: string }) {
  const { episode = [], image, name, highlight = "", id } = props;
  const matches = match(name, highlight, { insideWords: true });
  const parts = parse(name, matches);
  const { selection, addToSelection, removeFromSelection } = useSelection();
  const selected = selection.has(id);
  return (
    <div className="list-item" style={{ display: "flex", gap: "16px" }}>
      <input
        id={`character-${id}-cbox`}
        type="checkbox"
        checked={selected}
        onChange={(e) => {
          e.target.checked ? addToSelection(id) : removeFromSelection(id);
        }}
      />
      <label
        htmlFor={`character-${id}-cbox`}
        style={{
          display: "flex",
          gap: "16px",
          cursor: "pointer",
          flex: 1,
          alignItems: "center",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            borderRadius: "16px",
            height: "64px",
            aspectRatio: 1,
            objectFit: "cover",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span style={{ textAlign: "start" }}>
            {parts.map((part, index) => (
              <span
                key={index}
                style={{
                  fontWeight: part.highlight ? 800 : 400,
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
          <span style={{ fontSize: "80%" }}>{episode.length} Episodes</span>
        </div>
      </label>
    </div>
  );
}

export function CharacterList(props: {
  characters: Character[];
  inputValue: string;
}) {
  const { characters, inputValue } = props;
  if (characters.length < 1) {
    return <span>no result</span>;
  }
  return (
    <div className="vertical-flex">
      {characters.map((character) => (
        <CharacterItem highlight={inputValue} {...character} />
      ))}
    </div>
  );
}
