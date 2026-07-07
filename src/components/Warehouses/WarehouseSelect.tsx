import { useWarehouseContext } from "@/contexts/WarehouseContexts";
import { useProductContext } from "@/contexts/ProductContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInput from "../ui/custom/FormInput";

interface Props {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  selectOnly?: boolean;
}

export default function WarehouseSelect({
  value,
  onChange,
  label,
  selectOnly = false,
}: Props) {
  const { data: warehouses = [], isLoading } = useWarehouseContext();
  const productsQuery = useProductContext();
  const products = productsQuery?.data ?? [];

  const isOther = value === "other";
  const warehouseNames = new Set<string>();
  warehouses.forEach((wh: any) => {
    const name = wh.name?.trim();
    if (name) warehouseNames.add(name);
  });
  products.forEach((product: any) => {
    const warehouse = product.warehouse?.trim();
    if (warehouse) warehouseNames.add(warehouse);
  });
  const options = Array.from(warehouseNames)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      id: name,
      name,
    }));
  const selectOptions =
    value && !options.some((option) => option.id === value)
      ? [{ id: value, name: value }, ...options]
      : options;

  if (selectOnly) {
    return (
      <div className="text-right">
        <label className="block mb-1 text-sm font-medium">
          {label || "المستودع"}
        </label>
        <Select
          disabled={isLoading || selectOptions.length === 0}
          value={value || ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المستودع" />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div>
      {!isOther && (
        <FormInput
          disabled={isLoading}
          label={label || "المستودع المنقول إليه"}
          value={value}
          options={options}
          onChange={(e: any) => onChange(e.target.value)}
        />
      )}

      {isOther && (
        <FormInput
          label={label || "المستودع المنقول إليه"}
          placeholder="أدخل اسم المستودع الجديد"
          onBlur={(e) => {
            if (!e.target.value) return;
            onChange(e.target.value);
          }}
        />
      )}
    </div>
  );
}
