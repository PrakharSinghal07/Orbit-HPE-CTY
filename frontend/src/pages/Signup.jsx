import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signup } from "../apis/auth";
import { catchAsync, showSuccess } from "../utils/helper";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Signup = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      username: Yup.string("Invalid username")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      await catchAsync(
        async () => {
          const response = await signup(values.email, values.username, values.password);
          const { access_token, expires_at } = response;
          login(access_token, expires_at);
          showSuccess(response.message ?? "You have successfully signed up.");
        },
        { showToast: true }
      );

      setLoading(false);
    },
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <div className="bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold text-[#CE93D8] mb-4">
          Sign Up
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded border border-gray-600"
            />
            {formik.touched.username && formik.errors.username ? (
              <small className="text-red-400">{formik.errors.username}</small>
            ) : null}
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-2 p-2 bg-gray-700 text-white rounded border border-gray-600"
            />
            {formik.touched.email && formik.errors.email ? (
              <small className="text-red-400">{formik.errors.email}</small>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaRegEye color={"gray"} />
                ) : (
                  <FaRegEyeSlash color={"gray"} />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <small className="text-red-400">{formik.errors.password}</small>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <FaRegEye color={"gray"} />
                ) : (
                  <FaRegEyeSlash color={"gray"} />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <small className="text-red-400">
                {formik.errors.confirmPassword}
              </small>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg transition bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            disabled={loading}
          >
            Sign Up
          </button>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#CE93D8] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
