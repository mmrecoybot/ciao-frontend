
import React from 'react';
import ActivationForm from './ActivationForm';
import { getDictionary } from '@/app/[lang]/dictionary';

const ActivationFormHomePage = async({ params }) => {

  const { lang } =  params;
  const dictionary = await getDictionary(lang);
  return (
    <>
      <ActivationForm dictionary={dictionary} params={params} />
    </>
  );
};

export default ActivationFormHomePage;