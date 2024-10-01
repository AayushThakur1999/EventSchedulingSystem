export interface FormInputTextProps {
  label: string;
  name: string;
  type: "text" | "email" | "password";
  handleInputChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

export interface FormInputCheckboxProps {
  label: string;
  name: string;
  type: "checkbox";
  handleInputChange: React.Dispatch<React.SetStateAction<boolean>>;
  value: boolean;
}

export type FormInputProps = FormInputTextProps | FormInputCheckboxProps;

export interface AvailabilityProps {
  id: string;
  startDateAndTime: Date;
  endDateAndTime: Date;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export type UserNameAndDateBasedUsersData = {
  [username: string]: {
    [date: string]: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
};

export type TimeObject = {
  endTime: string;
  startTime: string;
};
