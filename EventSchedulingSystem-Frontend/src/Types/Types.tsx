export interface FormInputProps {
  label: string;
  name: string;
  type: string;
  handleInputChange: (value: string) => void;
  defaultValue?: string | number;
}