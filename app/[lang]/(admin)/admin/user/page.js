
import { getDictionary } from '@/app/[lang]/dictionary';
import UserPage from './UserPage';

const UserHomePage = async ({ params }) => {

  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <UserPage dictionary={dictionary} lang={lang}/>
    </>
  );
};

export default UserHomePage;