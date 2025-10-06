import { useFormContext, Controller } from "react-hook-form";

// ✅ Multi-checkbox group
interface Option {
  label: string;
  value: string;
}

interface FormCheckboxGroupProps {
  name: string;
  label: string;
  options: Option[];
}

export function FormCheckboxGroup({ name, label, options }: FormCheckboxGroupProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { value = [], onChange } }) => (
          <div className="flex flex-wrap gap-2 mt-1">
            {options.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={value.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...value, option.value]);
                    } else {
                      onChange(value.filter((v: string) => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 accent-[#FB923C] "
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      />
    </div>
  );
}
