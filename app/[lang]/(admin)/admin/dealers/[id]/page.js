

import { getDictionary } from '@/app/[lang]/dictionary';
import DealerDashboard from './DealerDashboard';

const DealerDashboardHomePage = async ({ params }) => {

  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <DealerDashboard dictionary={dictionary} params={params} lang={lang}/>
    </>
  );
};

export default DealerDashboardHomePage;