export default function FormInput({
    label,
    name,
    register,
    errors,
    type = "text",
    placeholder,
    className = "",
    required = false,
    ...props
  }) {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          {label}
        </label>
        <input
          {...register(name, { required: required && `${label} is required` })}
          type={type}
          id={name}
          placeholder={placeholder}
          className={`mt-1 block w-full border border-gray-300 dark:text-gray-200 placeholder:dark:text-gray-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
          {...props}
        />
        {errors[name] && (
          <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
        )}
      </div>
    );
  }