import React from 'react';
import SendMailForm from './_components/SendMailForm';
import { getDictionary } from '@/app/[lang]/dictionary';

const MailPage =async ({params}) => {
    const { lang } = params;
      const dictionary = await getDictionary(lang);
    return (
        <>
            <SendMailForm dictionary={dictionary} />
        </>
    );
};

export default MailPage;