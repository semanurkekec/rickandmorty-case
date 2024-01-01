import { useSelection } from "./store";

export default function Chips() {
  const { selection, removeFromSelection } = useSelection();
  const selectedIds = Array.from(selection);
  return (
    <div className="horizontal-flex" style={{ gap: "4px" }}>
      {selectedIds.map((id) => (
        <Chip character={{ id }} onRemove={removeFromSelection} />
      ))}
    </div>
  );
}

function Chip(props: {
  character: { id: number; name?: string };
  onRemove: (id: number) => void;
}) {
  const {
    character: { id, name = "unnamed" },
    onRemove,
  } = props;
  function handleRemove() {
    onRemove(id);
  }
  return (
    <div
      className="chip"
      style={{ display: "flex", alignItems: "center", gap: "4px" }}
    >
      <span>{name}</span>
      <button onClick={handleRemove}>x</button>
    </div>
  );
}
