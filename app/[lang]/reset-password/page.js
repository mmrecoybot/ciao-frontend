import ResetPassword from '../components/ResetPassword';
import { getDictionary } from '../dictionary';


export default async function ResetPasswordPage({ params,searchParams }) {
  const {lang} = params;
  const dictionary = await getDictionary(lang);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-center uppercase">Ciao Mobile</h1>
      <ResetPassword lang={lang} query={searchParams} dictionary={dictionary.loginPage} />
    </div>
  );
}
