"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { useChangeUserPasswordMutation } from "@/store/slices/userApi"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()
  const [changePassword, { isLoading, isError, isSuccess, error }] = useChangeUserPasswordMutation()
const {data: session} = useSession()

const router = useRouter()
  const onSubmit = async (data) => {

    const newPasswordData = {
      "newPassword": data.newPassword,
      "currentPassword": data.currentPassword,
      "id": Number(session?.user?.sub)
    }

   await changePassword(newPasswordData).unwrap();
  }
useEffect(() => {
  if (isError) {
    setError("currentPassword", {
      type: "manual",
      message: error?.data?.message,
    })
  }
}, [isError, error, setError])

useEffect(() => {
  if (isSuccess) {
    toast.success("Password changed successfully!")
    router.push("/")
  }
}, [isSuccess, router])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      {/* Current Password */}
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          {...register("currentPassword", { required: "Current password is required" })}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.currentPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          {...register("newPassword", { required: "New password is required" })}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          {...register("confirmNewPassword", {
            required: "Please confirm your new password",
            validate: (value) => value === watch("newPassword") || "Passwords do not match",
          })}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.confirmNewPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.confirmNewPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Changing Password..." : "Change Password"}
      </button>
    </form>
  )
}
