"use client";
import { login } from "@/app/actions";
import {
  Loader,
  LockIcon,
  MailWarning,
  User2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Kaushan_Script } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const festive = Kaushan_Script({ subsets: ["latin"], weight: "400" });

const DashboardLoginForm = ({ dictionary, lang }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    formData.append("email", formData.get("email").trim());
    formData.append("password", formData.get("password").trim());

    try {
      const response = await login(formData, "admin");
      if (response?.error) {
        throw new Error(response.error);
      }
      router.push(`/${lang}/admin/dashboard`);
    } catch (err) {
      setLoading(false);
      setError(dictionary.invalidEmailOrPassword);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto shadow-lg rounded-lg p-16"
      onSubmit={handleSubmit}>
      <h1
        className={`text-black inline-flex  rounded-2xl from-transparent from-10% via-emerald-400/20 via-50% to-transparent to-90% items-center justify-center mb-5 p-2 w-full text-center text-4xl font-thin ${festive.className}`}>
        📱 <span className="delay-700">Ciao Mobile</span>
      </h1>
      <h2 className="text-xl w-full font-bold text-black/80 text-center mb-4 inline-flex items-center justify-center gap-2">
        <User2 className="w-6 h-6" /> {dictionary.admin_login}
      </h2>

      {error && (
        <div className="text-sm text-red-500 w-full text-center my-4 inline-flex items-center justify-center gap-2 font-bold border border-red-500  p-2 rounded-md">
          <MailWarning className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-black/80 mb-2">
          {dictionary.email}
        </label>
        <input
          id="email"
          name="email"
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-800 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-black/50"
          placeholder={dictionary.enterYourEmail}
        />
      </div>

      <div className="mb-4 relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-black/80 mb-2">
          {dictionary.password}
        </label>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          className="w-full px-4 py-2 border border-gray-800 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-black/50"
          placeholder={dictionary.enterYourPassword}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-2/3 -translate-y-2/3 mt-1.5 right-3 flex items-center text-gray-600 hover:text-black">
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center">
        {loading ? (
          <Loader
            className="animate-spin mr-2 h-5 w-5 text-white"
            aria-hidden="true"
          />
        ) : (
          <LockIcon className="h-5 w-5 text-black-500 group-hover:text-indigo-400 mr-2" />
        )}
        {loading ? dictionary.signing_in : dictionary.sign_in}
      </button>

      <p className="text-sm text-center text-black mt-4">
        {dictionary.forgotPassword}?{" "}
        <Link
          href={`/${lang}/forgot-password`}
          className="text-blue-900 hover:underline">
          {dictionary.reset_password}
        </Link>
      </p>
    </form>
  );
};

export default DashboardLoginForm;
