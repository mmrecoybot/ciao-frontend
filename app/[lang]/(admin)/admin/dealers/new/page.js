

import React from 'react';
import AddNewDealer from './AddNewDealer';
import { getDictionary } from '@/app/[lang]/dictionary';

const AddNewDealerHomePage =async ({params}) => {

    const { lang } = params;
    const dictionary = await getDictionary(lang);

  return (
    <>
      <AddNewDealer dictionary={dictionary} params={params} />
    </>
  );
};

export default AddNewDealerHomePage;

