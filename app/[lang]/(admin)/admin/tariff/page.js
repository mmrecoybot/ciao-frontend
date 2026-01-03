

import { getDictionary } from '@/app/[lang]/dictionary';
import TarrifPage from './TarrifPage';

const TarrifHomePage = async ({ params }) => {

  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <TarrifPage dictionary={dictionary} lang={lang} />
    </>
  );
};

export default TarrifHomePage;