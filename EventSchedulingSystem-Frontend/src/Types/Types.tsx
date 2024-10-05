export interface FormInputProps<T extends string | boolean> {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "checkbox";
  value?: T;
  handleInputChange?: (value: T) => void;
}

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
