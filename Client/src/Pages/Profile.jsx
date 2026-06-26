import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(signOut());
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (!currentUser) {
    return (
      <div className="p-8">
        <p className="text-gray-700">لم تقم بتسجيل الدخول بعد.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <img
            src={
              currentUser.avatar ||
              "https://www.istockphoto.com/photo/mountain-landscape-gm517188688-89380423"
            }
            alt={currentUser.username || currentUser.email}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{currentUser.username}</h2>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Profile;
