frontend/
├── .env
├── .environemnt.example.text
├── .eslintrc.json
├── .gitignore
├── README.md
├── auth.config.js
├── auth.js
├── jsconfig.json
├── middleware.js
├── next.config.js
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.js
│
├── app/
│   └── [lang]/
│       ├── (admin)/
│       │   └── admin/
│       │       ├── activation/
│       │       ├── banner/
│       │       ├── brands/
│       │       ├── category/
│       │       │   └── sub-category/
│       │       ├── company/
│       │       └── components/
│       └── (customer)/
│           └── customer/
│               └── personal-data/
│
├── db/
│   └── db.js
│
├── public/
│   └── assets/
│       ├── icons/
│       │   ├── bd.svg
│       │   └── usa.png
│       ├── 1.jpg
│       ├── 2.jpeg
│       ├── 3.jpeg
│       ├── 4.jpg
│       ├── 5.avif
│       ├── kolme.png
│       └── logo.jpg
│
├── store/
│   ├── api/
│   │   └── apiSlice.js
│   ├── selector/
│   │   ├── helper.js
│   │   └── selectFilterProducts.js
│   └── slices/
│       ├── CategoryApi.js
│       ├── activationApi.js
│       ├── bannerApi.js
│       ├── brandApi.js
│       ├── cartApi.js
│       ├── companyApi.js
│       ├── filterSlice.js
│       ├── notificationApi.js
│       ├── orderApi.js
│       ├── permissionApi.js
│       ├── productApi.js
│       ├── roleApi.js
│       ├── shopApi.js
│       ├── simSerialApi.js
│       ├── subCategoryApi.js
│       ├── tarrifApi.js
│       ├── tarrifOptionApi.js
│       ├── uplodApi.js
│       └── userApi.js
│
└── utils/