import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInstart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { useSelector } from "react-redux";
const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // preventDefault is used to prevent the default form submission behavior, which would cause a page reload. By calling e.preventDefault(), we can handle the form submission in JavaScript, allowing us to perform actions like sending data to a server without refreshing the page.
    e.preventDefault();
    try {
      dispatch(signInstart());
      const response = await fetch("/api/signUp/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // This option is used to include cookies in the request, which is necessary for authentication purposes when the server sets an HTTP-only cookie containing a JWT token upon successful sign-in.
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }

    // this is where you would typically handle form submission, e.g., send data to a server
  };
  return (
    <div className=" min-h-screen   bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <section className="rounded-md p-2 bg-white">
        <div className="  flex items-center justify-center my-3">
          <div className="xl:mx-auto shadow-md p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="mb-2"></div>
            <h2 className="text-2xl font-bold leading-tight">
              Sign in to FDT<span className="text-yellow-500">Estate</span>
            </h2>

            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Email"
                      type="email"
                      id="email"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={handelChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-base font-medium text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      placeholder="Password"
                      type="password"
                      id="password"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={handelChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loadin..." : "Sign in"}
                  </button>
                </div>
              </div>
            </form>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            <p className="mt-2 text-base text-gray-600">
              Don't have an account?
              <Link to="/signUp" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
