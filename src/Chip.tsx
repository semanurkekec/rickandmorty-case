import { useQuery } from "@tanstack/react-query";
import { getCharacterById } from "./service/api";

export default function Chip(props: {
  character: { id: number };
  onRemove: (id: number) => void;
}) {
  const {
    character: { id },
    onRemove,
  } = props;
  const query = useQuery({
    queryKey: ["character", id],
    queryFn: async () => await getCharacterById(id),
  });
  if (query.isError) {
    throw query.error;
  }
  if (query.isLoading || query.isPending) {
    return <span>loading</span>;
  }
  const { name } = query.data;
  function handleRemove() {
    onRemove(id);
  }
  return (
    <div
      className="chip"
      style={{ display: "flex", alignItems: "center", gap: "4px" }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {name}
      </span>
      <button
        className="remove"
        onClick={(e) => {
          e.preventDefault();
          handleRemove();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          viewBox="0 -960 960 960"
          width="16"
        >
          <path
            fill="currentcolor"
            d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"
          />
        </svg>
      </button>
    </div>
  );
}
