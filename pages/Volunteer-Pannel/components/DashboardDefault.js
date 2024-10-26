import React from 'react'
import DashboardCard from './DashboardCard'

const DashboardDefault = () => {
  return (
    <div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <DashboardCard title="Total Views" amount="$3.456K" change={0.43} />
    <DashboardCard title="Total Profit" amount="$45,2K" change={4.35} />
    <DashboardCard title="Total Product" amount="2.450" change={2.59} />
    <DashboardCard title="Total Users" amount="3.456" change={-0.95} />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
    <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-gray-600">Profit this week</h4>
        <div className="mt-4 h-64 bg-gray-100"> {/* Placeholder for bar chart */}</div>
    </div>
</div></div>
  )
}

export default DashboardDefault