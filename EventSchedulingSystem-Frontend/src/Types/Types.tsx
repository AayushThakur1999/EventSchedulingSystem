export interface FormInputProps {
  label: string;
  name: string;
  type: string;
  handleInputChange: (value: string) => void;
  defaultValue?: string | number;
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
