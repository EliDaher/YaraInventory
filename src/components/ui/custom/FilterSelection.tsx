import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

export default function FilterSelection({
  DataToFilter,
  selectedFilter,
  setSelectedFilter,
  FilterBy,
  Placeholder,
}: {
  DataToFilter: any[];
  selectedFilter: any;
  setSelectedFilter: (value: any) => void;
  FilterBy: string;
  Placeholder: string;
}) {
  return (
    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
      <SelectTrigger>
        <SelectValue placeholder={Placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="all" value="all">
          الكل
        </SelectItem>

        {[
          ...new Set(
            Object.values(DataToFilter || {}) // تحويل الكائن لمصفوفة
              .flatMap((w: any) => Object.values(w)) // كل المنتجات داخل المستودع
              .map((p: any) => p[FilterBy]?.trim()) // ✅ الوصول للحقل ديناميكيًا
              .filter(Boolean),
          ),
        ].map((value) => (
          <SelectItem key={value as string} value={value as string}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
