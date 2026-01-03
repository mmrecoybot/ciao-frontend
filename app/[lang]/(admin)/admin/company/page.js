
import React from 'react';
import CompanyPage from './CompanyPage';
import { getDictionary } from '@/app/[lang]/dictionary';

const CompanyHomePage = async ({params}) => {
  
  const {lang} = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <CompanyPage dictionary={dictionary} lang={lang}/>
    </>
  );
};

export default CompanyHomePage;