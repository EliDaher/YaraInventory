import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../input";
import { useEffect } from "react";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  options?: { id: string; name: string }[];
};

export default function FormInput({
  options,
  label,
  error,
  className,
  value,
  onChange,
  ...props
}: FormInputProps) {

  // ==========================
  //      SELECT MODE
  // ==========================
  if (options && options.length > 0 && value !== 'other') {
    return (
      <div className="text-right">
        <label className="block mb-1 text-sm font-medium">{label}</label>

        <Select
          value={value ? String(value) : ""}
          onValueChange={(v) => onChange?.(v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر خيارًا" />
          </SelectTrigger>

          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
            <SelectItem key={"other"} value={"other"}>
              غير ذلك
            </SelectItem>
          </SelectContent>
        </Select>

        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // ==========================
  //      INPUT MODE
  // ==========================
  return (
    <div className="text-right">
      <label
        htmlFor={props.id}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <Input
        {...props}
        value={value}
        onChange={onChange}
        className={`text-right border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error ? "border-red-500" : ""
        } ${className || ""}`}
      />

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
