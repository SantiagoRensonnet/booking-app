import Input from "./Input";

export default function NumberRangeInput({ separator,name }) {
  return (
    <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
      <Input name={`${name}_min`} $width="100%" type="number" />
      {separator && <span>{separator}</span>}
      <Input name={`${name}_max`} $width="100%" type="number" />
    </div>
  );
}