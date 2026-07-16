import Link from "next/link";

type TermsConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
};

export function TermsConsentCheckbox({
  checked,
  onChange,
  className = "flex items-start gap-3 cursor-pointer",
  labelClassName = "text-slate-300 text-sm leading-relaxed",
}: TermsConsentCheckboxProps) {
  return (
    <label className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
        required
      />
      <span className={labelClassName}>
        I understand the{" "}
        <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
          Privacy Policy
        </Link>
        . <span className="text-rose-400">*</span>
      </span>
    </label>
  );
}
