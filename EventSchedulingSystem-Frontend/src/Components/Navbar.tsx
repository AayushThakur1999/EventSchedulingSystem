import React, { useState } from "react";
import Modal from "./Modal";
import FormInput from "./FormInput";
import { Form, useNavigate } from "react-router-dom";
import SubmitBtn from "./SubmitBtn";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = ({
  name,
  logoutUser,
}: {
  name: string;
  logoutUser: () => void;
}) => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleUpdateDetails = () => setModalContent("Update Details");
  const handleChangePassword = () => setModalContent("Change Password");
  const handleLogout = () => setModalContent("Logout");

  const closeModal = () => setModalContent(null);

  const submitDetailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userDetails = Object.fromEntries(formData);
    try {
      const response = await axios.patch("/users/update-details", userDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("User Detail updated Response:", response);
      const user = response.data.data;
      toast.success("Successfully registered!! ");
      navigate(`/user/${user._id}`);
      closeModal();
    } catch (error) {
      closeModal();
      console.log("ERROR:", error);
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      } else {
        toast.error("An error occured while trying to update user details :[");
        throw new Error("Something went wrong while updating user details");
      }
    }
  };

  const submitPasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { currentPassword, newPassword, newPasswordConfirmation } =
      Object.fromEntries(formData);
    if (newPassword !== newPasswordConfirmation) {
      return toast.error("Your new password entries are different!");
    }
    try {
      await axios.patch(
        "/users/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Password changed successfully :)");
      closeModal();
    } catch (error) {
      closeModal();
      console.log("ERROR:", error);
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      } else {
        toast.error("An error occured while trying to change your password :(");
        throw new Error("Something went wrong while updating user details");
      }
    }
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <h2 className="text-4xl font-bold text-primary">Welcome, {name}</h2>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src="/image.png" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a onClick={handleUpdateDetails}>Update Details</a>
            </li>
            <li>
              <a onClick={handleChangePassword}>Change Password</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modalContent === "Update Details"} onClose={closeModal}>
        <h2 className="text-xl font-bold mt-2">Update Your Details</h2>
        <Form method="POST" onSubmit={submitDetailChange}>
          <FormInput type="text" label="fullname" name="fullname" />
          <FormInput type="text" label="email" name="email" />
          <div className="mt-4">
            <SubmitBtn text="submit" />
          </div>
        </Form>
      </Modal>

      <Modal isOpen={modalContent === "Change Password"} onClose={closeModal}>
        <h2 className="text-xl font-bold mt-2">Change Your Password</h2>
        <Form method="POST" onSubmit={submitPasswordChange}>
          <FormInput
            type="password"
            label="current password"
            name="currentPassword"
          />
          <FormInput type="password" label="new password" name="newPassword" />
          <FormInput
            type="password"
            label="confirm new password"
            name="newPasswordConfirmation"
          />
          <div className="mt-4">
            <SubmitBtn text="submit" />
          </div>
        </Form>
      </Modal>

      <Modal isOpen={modalContent === "Logout"} onClose={closeModal}>
        <h2 className="text-xl font-bold mt-2">Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <button
          className="btn btn-sm btn-primary mt-4 text-slate-100 border-neutral-300 hover:scale-105 hover:bg-error"
          onClick={logoutUser}
        >
          Logout
        </button>
      </Modal>
    </div>
  );
};

export default Navbar;
