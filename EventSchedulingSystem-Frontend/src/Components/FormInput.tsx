import { FormInputProps } from "../Types/Types";

const FormInput = ({
  label,
  name,
  type,
  defaultValue = "",
  handleInputChange,
}: FormInputProps) => {
  return (
    <div className="form-control">
      <div className="label">
        <span className="label-text capitalize">{label}</span>
      </div>
      <input
        type={type}
        name={name}
        placeholder="Type here"
        className="input input-bordered"
        defaultValue={defaultValue}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </div>
  );
};
export default FormInput;
