import Link from "next/link";
import { privacyPath, termsPath } from "@/content/landing-content";

type TermsConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
};

export function TermsConsentCheckbox({
  checked,
  onChange,
  className = "terms-consent",
  labelClassName = "terms-consent-label",
}: TermsConsentCheckboxProps) {
  return (
    <label className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="terms-consent-input"
        required
      />
      <span className={labelClassName}>
        I understand the{" "}
        <Link href={termsPath} target="_blank" rel="noopener noreferrer" className="terms-consent-link">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link href={privacyPath} target="_blank" rel="noopener noreferrer" className="terms-consent-link">
          Privacy Policy
        </Link>
        . <span className="terms-consent-required">*</span>
      </span>
    </label>
  );
}
