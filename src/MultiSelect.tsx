import { useDebounce } from "./utils/useDebounce";
import { ChangeEvent, useState } from "react";
import { CharacterResult } from "./CharacterList";
import SearchInput from "./SearchInput";

export default function MultiSelect() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search);
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <div style={{ width: "450px" }}>
      <SearchInput
        isTyping={debounced !== search}
        value={search}
        onChange={handleSearch}
      />
      <div className="scrollable border">
        <CharacterResult inputValue={debounced} />
      </div>
    </div>
  );
}
