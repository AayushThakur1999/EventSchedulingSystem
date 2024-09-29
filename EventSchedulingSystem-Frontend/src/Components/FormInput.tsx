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

  return (
    <div className="form-control">
      <div className="label">
        <span className="label-text capitalize">{label}</span>
      </div>
      <input
        type={type}
        name={name}
        placeholder={type !== "checkbox" ? "Enter text here..." : undefined}
        className={
          type !== "checkbox"
            ? "input input-bordered"
            : "checkbox border-orange-400 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange] checked:border-indigo-800 ml-1"
        }
        checked={type === "checkbox" ? (value as boolean) : undefined}
        value={type !== "checkbox" ? (value as string) : undefined}
        onChange={handleChange}
      />
    </div>
  );
};
export default FormInput;
