import { useFormContext } from "react-hook-form";

// ✅ Reusable checkbox component (fits with FormInput style)
export function FormCheckbox({ name, label }: { name: string; label: React.ReactNode }) {
  const { register } = useFormContext();
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={name}
        {...register(name)}
        className="w-4 h-4 rounded border-gray-300"
      />
      <label htmlFor={name} className="text-sm text-gray-600">
        {label}
      </label>
    </div>
  );
}