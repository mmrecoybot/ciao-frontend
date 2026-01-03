import React from 'react'
import { getDictionary } from '@/app/[lang]/dictionary';
import ActivationPageComponent from './_components/ActivationPageComponent';

export default async function ActivationPage({ params ,searchParams}) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  return (
    <ActivationPageComponent dictionary={dictionary} params={params} searchParams={searchParams} />
  )
}
