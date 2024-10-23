const Navbar = ({
  name,
  logoutUser,
}: {
  name: string;
  logoutUser: () => void;
}) => {
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
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Update Details</a>
            </li>
            <li>
              <a>Change Password</a>
            </li>
            <li onClick={() => logoutUser()}>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
