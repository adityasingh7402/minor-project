import React from 'react'
import DashboardView from './DashboardView'

const DashboardDefault = () => {
  return (
    <div>
    <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-gray-600">Other NGOs</h4>
        <div className="mt-4"> <DashboardView /></div>
</div></div>
  )
}

export default DashboardDefault