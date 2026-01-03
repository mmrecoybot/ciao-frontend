'use client'

import React from 'react'
import WorkflowTable from './components/WorkFlowTable'
import { useFetchWorkflowsQuery } from '@/store/slices/workFlowApi'
import Loading from '@/app/[lang]/(customer)/customer/components/Loading'


export default function Logs() {

  const {data: workflows , isLoading}=useFetchWorkflowsQuery()

  if (isLoading) {
    return <Loading />
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">System Logs</h1>
      <WorkflowTable data={workflows} />
    </div>
  )
}
