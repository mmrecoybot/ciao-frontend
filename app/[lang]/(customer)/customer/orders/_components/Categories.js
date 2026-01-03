const Categories = ({ categories, lang, selectedCategory, onCategoryChange ,initalCategory}) => {

  
  
  return (
    <div className="px-4 pt-2 mb-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 overflow-x-auto border-gray-200 p-1">
      {categories.map((category) => {
        const isSelected = selectedCategory.toLowerCase() === category.name.toLowerCase();
        return (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={`flex items-center justify-between border border-gray-500 rounded-md  gap-2 px-2 py-1 text-md font-medium capitalize text-blue-500 dark:text-blue-600 whitespace-nowrap hover:bg-blue-50 ${
              isSelected
                ? "font-medium bg-blue-800 text-white dark:bg-blue-300 hover:bg-blue-800 dark:text-blue-900"
                : "font-light"
            }`}
          >
            {category.name}
            <span className="bg-blue-700 dark:bg-blue-500 text-white px-2 py-0.5 rounded-sm text-sm">
              {category?.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Categories;