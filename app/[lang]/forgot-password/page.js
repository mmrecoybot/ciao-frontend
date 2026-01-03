import React from 'react'
import ForgotPassword from '../components/ForgetPassWord'
import { getDictionary } from '../dictionary'

export default async function ForgetPasswordPage({ params }) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="container mx-auto py-10 flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-bold mb-5 text-center uppercase">
        ciao mobile
      </h1>
      <ForgotPassword dictionary={dictionary.loginPage} />
    </div>
  );
}
