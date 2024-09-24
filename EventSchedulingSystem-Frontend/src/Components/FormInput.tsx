import { FormInputProps } from "../Types/types";

const FormInput = ({ label, name, type, defaultValue }: FormInputProps) => {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text capitalize font-semibold">{label}</span>
      </div>
      <input
        type={type}
        name={name}
        placeholder="Type here"
        className="input input-bordered w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        defaultValue={defaultValue}
      />
    </label>
  );
};
export default FormInput;
