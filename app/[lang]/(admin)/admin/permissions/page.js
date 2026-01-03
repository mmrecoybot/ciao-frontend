
import { getDictionary } from '@/app/[lang]/dictionary';
import PermissionPage from './PermissionPage';

const PermissionHomePage =async ({ params }) => {

  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <PermissionPage dictionary={dictionary} />
    </>
  );
};

export default PermissionHomePage;