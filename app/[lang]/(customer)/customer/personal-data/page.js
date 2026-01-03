import React from 'react'
import PersonalData from './components/DealerPage'
import { getDictionary } from '@/app/[lang]/dictionary';

export default async function PersonalDataPage({ params }) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return (
    <div className='w-full p-6'>
      <PersonalData dictionary={dictionary} />
    </div>
  );
}
