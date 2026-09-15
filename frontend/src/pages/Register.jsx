import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/auth/register", formData);

      alert("Registration Successful ✅");

      navigate("/login");

    } catch (err) {

      alert(err.response?.data?.message || "Registration Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">

      <form
        onSubmit={handleSubmit}
        className="glass w-[420px] p-8 rounded-2xl"
      >

        <h1 className="text-4xl font-bold text-center mb-8">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-slate-800"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center mt-6">
          Already have an account?

          <Link
            to="/login"
            className="text-cyan-400 ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}