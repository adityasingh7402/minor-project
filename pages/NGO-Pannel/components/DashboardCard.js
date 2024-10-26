// components/DashboardCard.js
export default function DashboardCard({ title, amount, change }) {
    return (<>
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-gray-600">{title}</h4>
        <p className="text-2xl font-bold">{amount}</p>
        <p className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? '+' : ''}{change}%
        </p>
      </div>
    </>
    );
  }
  