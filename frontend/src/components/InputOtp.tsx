import { useEffect, useRef } from "react";

interface InputOtpProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function InputOtp({
  value,
  onChange,
  disabled = false,
}: InputOtpProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, "").slice(-1);

    const otpArray = value.padEnd(6, "").split("");
    otpArray[index] = digit;

    const newValue = otpArray.join("").replace(/ /g, "");
    onChange(newValue);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasted.length > 0) {
      onChange(pasted);

      const nextIndex = Math.min(pasted.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-xl font-bold rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#42b883]/50 focus:border-[#42b883] transition"
        />
      ))}
    </div>
  );
}

export default InputOtp;

