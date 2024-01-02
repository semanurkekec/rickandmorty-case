import { ChangeEvent, useRef } from "react";
import Chip from "./Chip";
import { useSelection } from "./store";

export default function SearchInput(props: {
  isTyping: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { isTyping, ...rest } = props;
  const { selection, removeFromSelection, removeLast } = useSelection();
  const selectedIds = Array.from(selection);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className="border multiselect-wrapper"
      onClick={(e) => {
        if (e.defaultPrevented) {
          return;
        }
        ref.current?.focus();
      }}
    >
      <div className="horizontal-scrollable">
        {selectedIds.map((id) => (
          <Chip character={{ id }} onRemove={removeFromSelection} />
        ))}
        <input
          ref={ref}
          className="multiselect"
          {...rest}
          onKeyDown={(e) => {
            const index = e.currentTarget.selectionStart;
            if (index === 0 && e.key === "Backspace") {
              removeLast();
            }
          }}
        />
      </div>
      {isTyping && <div className="loader" />}
    </div>
  );
}
