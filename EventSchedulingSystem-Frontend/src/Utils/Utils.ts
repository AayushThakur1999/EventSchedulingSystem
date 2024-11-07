import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

export function convertTo24HourFormat(time: string): string {
  const [timePart, modifier] = time.split(" ");
  // console.log(timePart.split(":"));

  const [tempHours, minutes, seconds] = timePart.split(":"); // 'hours' may change, so it's kept as let.
  let hours = tempHours;
  // Convert "12" hour correctly
  if (hours === "12") {
    hours = modifier === "AM" ? "00" : "12";
  } else if (modifier === "PM") {
    hours = String(Number(hours) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}:${seconds}`;
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  dateStyle: "full",
  timeStyle: "short",
  hour12: true,
};

export const logoutUser = async (navigate: NavigateFunction) => {
  try {
    const response = await axios.post("/users/logout", {});
    console.log(response);
    toast(response.data?.message || "You have Logged-Out Successfully :)");
    navigate("/login");
  } catch (error) {
    console.error(error);
  }
};