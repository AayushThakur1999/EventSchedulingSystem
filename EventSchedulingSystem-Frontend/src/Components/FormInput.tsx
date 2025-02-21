import { useState } from "react";
import { FormInputProps } from "../Types";
import { Eye, EyeOff } from "lucide-react";

const FormInput = <T extends string | boolean>({
  label,
  name,
  type,
  handleInputChange,
  value,
}: FormInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isCheckbox = type === "checkbox";
  const isPassword = type === "password";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (handleInputChange) {
      const newValue = isCheckbox ? e.target.checked : e.target.value;
      handleInputChange(newValue as T);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getAutocomplete = () => {
    if (type === "password") {
      return name === "newPassword" || name === "newPasswordConfirmation"
        ? "new-password"
        : "current-password";
    }
    if (type === "email") {
      return "email";
    }
    if (type === "text") {
      if (name === "fullname") {
        return "name";
      }
      if (name === "username") {
        return "username";
      }
    }
    return undefined;
  };

  return (
    <div className="form-control">
      <div className="label">
        <span className="label-text capitalize">{label}</span>
      </div>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          name={name}
          placeholder={isCheckbox ? undefined : `Enter ${label} here...`}
          className={
            isCheckbox
              ? "checkbox border-orange-400 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange] checked:border-indigo-800 ml-1"
              : "input input-bordered w-full"
          }
          checked={isCheckbox ? (value as boolean) : undefined}
          value={!isCheckbox ? (value as string) : undefined}
          onChange={handleChange}
          autoComplete={getAutocomplete()}
          required={!isCheckbox}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-1 right-2 p-[10px] rounded-full flex items-center"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
