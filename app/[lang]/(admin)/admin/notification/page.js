import React from 'react';
import SendNotificationForm from './_components/SendNotificationForm';
import { getDictionary } from '@/app/[lang]/dictionary';

const NotificationPage = async ({params}) => {
      const { lang } = params;
      const dictionary = await getDictionary(lang);
    return (
        <>
            <SendNotificationForm dictionary={dictionary} />
        </>
    );
};

export default NotificationPage;