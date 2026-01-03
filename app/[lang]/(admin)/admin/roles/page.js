

import { getDictionary } from '@/app/[lang]/dictionary';
import RolesPage from './RolesPage';

const RolesHomePage = async ({ params }) => {

  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <RolesPage dictionary={dictionary} />
    </>
  );
};

export default RolesHomePage;