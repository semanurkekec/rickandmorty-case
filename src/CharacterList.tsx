import match from "autosuggest-highlight/match";
import { Character } from "./interfaces";
import { getCharacters } from "./service/api";
import parse from "autosuggest-highlight/parse";
import { useSelection } from "./store";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function CharacterResult(props: { inputValue: string }) {
  const query = useInfiniteQuery({
    queryKey: ["characters", props.inputValue],
    initialPageParam: "0",
    queryFn: async ({ pageParam }) =>
      await getCharacters({ name: props.inputValue, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const next = lastPage.info.next;
      if (next) {
        const { searchParams } = new URL(next);
        return searchParams.get("page");
      }
      return undefined;
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
  const { fetchNextPage, data, hasNextPage, isFetchingNextPage } = query;
  const results = data.pages.flatMap((page) => page.results);
  return (
    <>
      <CharacterList characters={results} {...props} />
      {hasNextPage ? (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={{ marginTop: "8px" }}
        >
          load more
        </button>
      ) : (
        <span style={{ fontSize: "12px", opacity: 0.6 }}>
          <i>end of list</i>
        </span>
      )}
    </>
  );
}
function CharacterItem(props: Character & { highlight?: string }) {
  const { highlight = "", ...rest } = props;
  const { episode = [], image, name, id } = rest;
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.setQueryData<Character>(["character", id], (prev) => {
      if (prev) {
        return prev;
      }
      return rest;
    });
  }, [rest, id, queryClient]);
  const matches = match(name, highlight, { insideWords: true });
  const parts = parse(name, matches);
  const { selection, addToSelection, removeFromSelection } = useSelection();
  const selected = selection.has(id);
  return (
    <label className="list-item" htmlFor={`character-${id}-cbox`}>
      <div style={{ display: "flex", gap: "12px" }}>
        <input
          id={`character-${id}-cbox`}
          type="checkbox"
          checked={selected}
          onChange={(e) => {
            e.target.checked ? addToSelection(id) : removeFromSelection(id);
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              borderRadius: "16px",
              height: "56px",
              aspectRatio: 1,
              objectFit: "cover",
            }}
          />
          <div
            style={{
              display: "flex",

              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span className="title" style={{ textAlign: "start" }}>
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
            <span className="label">{episode.length} Episodes</span>
          </div>
        </div>
      </div>
    </label>
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
