export default function FormSelect({
    label,
    name,
    register,
    errors,
    options,
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
        <select
          className={`mt-1 block w-full border capitalize border-gray-300 dark:text-gray-200 placeholder:dark:text-gray-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
          {...register(name, {
            required: required && `${label} is required`,
          })}
          {...props}
        >
          <option value="" className="capitalize dark:bg-gray-900">
            Select {label}
          </option>
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="capitalize dark:bg-gray-900"
            >
              {option.label}
            </option>
          ))}
        </select>
        {errors[name] && (
          <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
        )}
      </div>
    );
  }