import { FormInputProps } from "../Types/Types";

const FormInput = ({
  label,
  name,
  type,
  value,
  handleInputChange,
}: FormInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "checkbox") {
      handleInputChange(e.target.checked);
    } else {
      handleInputChange(e.target.value);
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
        placeholder={type !== "checkbox" ? `Enter ${label} here...` : undefined}
        className={
          type !== "checkbox"
            ? "input input-bordered"
            : "checkbox border-orange-400 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange] checked:border-indigo-800 ml-1"
        }
        checked={type === "checkbox" ? (value as boolean) : undefined}
        value={type !== "checkbox" ? (value as string) : undefined}
        onChange={handleChange}
        autoComplete={getAutocomplete()}
        required={type === "checkbox" ? false : true}
      />
    </div>
  );
};
export default FormInput;
