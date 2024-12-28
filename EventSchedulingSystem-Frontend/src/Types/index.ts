export interface FormInputProps<T extends string | boolean> {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "checkbox";
  value?: T;
  handleInputChange?: (value: T) => void;
}

export interface AvailabilityProps {
  _id?: string;
  userId: string;
  startDateAndTime: Date;
  endDateAndTime: Date;
  // startDate: string;
  // endDate: string;
  // startTime: string;
  // endTime: string;
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

export type UserData = {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

export type userLoaderData = {
  userData: UserData;
  userAvailabilities: Array<AvailabilityProps>;
};

export type UserAndAvailabilityData = {
  _id: string;
  userId: {
    _id: string;
    fullname: string;
    username: string;
  };
  startDateAndTime: string;
  endDateAndTime: string;
};
export type adminLoaderData = {
  userData: UserData;
  allUsersAvailabilities: Array<UserAndAvailabilityData>;
};

export type TimeSlot = {
  meetingStartTime: Date;
  meetingEndTime: Date;
};

export type SessionData = {
  _id: string;
  username: string;
  schedule: TimeSlot;
  eventName: string;
  multipleAttendees: boolean;
};

export type EventNameSessionDetails = {
  _id: string;
  username: string;
  multipleAttendees: boolean;
  schedule: TimeSlot;
};

export type EventBasedData = Record<string, EventNameSessionDetails[]>;
