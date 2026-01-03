'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function WorkflowTable({ data }) {
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const formatMetadata = (metadata) => {
    if (metadata) {
      return Object?.entries(metadata).map(([key, value]) => (
        <div key={key} className="text-sm w-full">
          <span className="font-medium text-wrap">{key}: </span>
          {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
        </div>
      ))
    }

    return null

  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-gray-100">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 w-[40px] px-4"></th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Updated At</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data?.map((workflow) => (
              <>
                <tr
                  key={workflow.id}
                  className="border-b transition-colors hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(workflow.id)}
                >
                  <td className="p-4">
                    {expandedRows.has(workflow.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="p-4">{workflow.id}</td>
                  <td className="p-4">{workflow.type}</td>
                  <td className="p-4">{workflow.referenceId}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${workflow.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        workflow.status === '200' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {workflow.status}
                    </span>
                  </td>
                  <td className="p-4">{formatDate(workflow.createdAt)}</td>
                  <td className="p-4">{formatDate(workflow.updatedAt)}</td>
                </tr>
                {expandedRows.has(workflow.id) && workflow?.steps?.map((step) => (
                  <tr key={`${workflow.id}-${step.id}`} className="bg-gray-50">
                    <td colSpan={7} className="p-4">
                      <div className="ml-8">
                        <div className="font-medium mb-2">Step Details:</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div><span className="font-medium">Action:</span> {step.action}</div>
                            <div><span className="font-medium">Actor Role:</span> {step.actorRole}</div>
                            <div><span className="font-medium">Actor ID:</span> {step.actorId}</div>
                            <div><span className="font-medium">Created At:</span> {formatDate(step.createdAt)}</div>
                          </div>
                          <div className="overflow-x-auto w-full">
                            <div className="font-medium mb-1">Metadata:</div>
                            {formatMetadata(step.metadata)}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}