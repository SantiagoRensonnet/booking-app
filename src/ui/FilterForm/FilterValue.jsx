import { useFormContext } from "react-hook-form";

import NumberRangeInput from "../NumberRangeInput";
import Input from "../Input";
import FormTabs from "../FormTabs";
export default function FilterValue({ filter, filterNames, layout }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isBooleanOrEnum = filter.type === "boolean" || filter.type === "enum";
  const isRange = filter.condition === "range";

  const isDate = filter.type === "date";
  const isNumber = filter.type === "number";

  if (isBooleanOrEnum)
    return (
      <FormTabs
        $column="2/4"
        name={filterNames.value}
        criteria={filter.criteria}
        type={filter.type === "boolean" ? "radio" : "checkbox"}
        options={filter.conditionOptions}
        checkAllValue={filter.columnFilterAllName}
        controlled
      />
    );

  if (isRange) {
    return (
      <NumberRangeInput
        name={filterNames.value}
        separator="and"
        min={filter.min}
        max={filter.max}
        filterLabel={filter.label}
        defaultMin={filter.defaultValueMin}
        defaultMax={filter.defaultValueMax}
        type={filter.type}
        maxWidth={layout?.maxWidth?.input}
        controlled
      />
    );
  }

  if (isDate)
    return (
      <Input
        {...register(filterNames.value, {
          required: "This field is required",
          min: {
            value: filter.min,
            message: `Only dates after ${filter.min} are accepted`,
          },
          max: {
            value: filter.min,
            message: `Only dates before ${filter.max} are accepted`,
          },
        })}
        type="date"
        $maxWidth={layout?.maxWidth?.input}
        aria-invalid={errors[filterNames.value] ? "true" : "false"}
        defaultValue={filter.defaultValue}
      />
    );

  if (isNumber) {
    return (
      <Input
        {...register(filterNames.value, {
          required: "This field is required",
          min: {
            value: filter.min,
            message: `${filter.label} should be at least ${filter.min}`,
          },
          max: {
            value: filter.max,
            message: `${filter.label} should be less than ${filter.max}`,
          },
        })}
        type="number"
        $maxWidth={layout?.maxWidth?.input}
        aria-invalid={errors[filterNames.value] ? "true" : "false"}
        defaultValue={filter.defaultValue}
      />
    );
  }

  return (
    <Input
      {...register(filterNames.value, {
        required: "This field is required",
      })}
      type="text"
      $maxWidth={layout?.maxWidth?.input}
      aria-invalid={errors[filterNames.value] ? "true" : "false"}
      defaultValue={filter.defaultValue}
    />
  );
}
