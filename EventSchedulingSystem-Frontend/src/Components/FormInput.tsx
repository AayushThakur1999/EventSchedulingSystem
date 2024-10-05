import { FormInputProps } from "../Types/Types";

const FormInput = <T extends string | boolean>({
  label,
  name,
  type,
  handleInputChange,
  value,
}: FormInputProps<T>) => {
  const isCheckbox = type === "checkbox";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (handleInputChange) {
      const newValue = isCheckbox ? e.target.checked : e.target.value;
      handleInputChange(newValue as T);
    }
  };

  const getAutocomplete = () => {
    if (type === "password") {
      return name === "newPassword" ? "new-password" : "current-password";
    }
    if (type === "email") {
      return "email"; // Use "email" for email fields
    }
    if (type === "text") {
      if (name === "fullname") {
        return "name"; // "name" for fullname
      }
      if (name === "username") {
        return "username"; // "username" for username
      }
    }
    return undefined; // No autocomplete for other input types by default
  };

  return (
    <div className="form-control">
      <div className="label">
        <span className="label-text capitalize">{label}</span>
      </div>
      <input
        type={type}
        name={name}
        placeholder={isCheckbox ? undefined : `Enter ${label} here...`}
        className={
          isCheckbox
            ? "checkbox border-orange-400 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange] checked:border-indigo-800 ml-1"
            : "input input-bordered"
        }
        checked={isCheckbox ? (value as boolean) : undefined}
        value={!isCheckbox ? (value as string) : undefined}
        onChange={handleChange}
        autoComplete={isCheckbox ? undefined : getAutocomplete()}
        required={!isCheckbox}
      />
    </div>
  );
};
export default FormInput;
