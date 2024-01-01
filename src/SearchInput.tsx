import { ChangeEvent } from "react";
import Chips from "./Chip";

export default function SearchInput(props: {
  isTyping: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { isTyping, ...rest } = props;
  return (
    <div className="border multiselect-wrapper">
      <Chips />
      <input className="multiselect" {...rest} />
      {isTyping && <div className="loader" />}
    </div>
  );
}
