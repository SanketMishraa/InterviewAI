export default function StatCard({
    title,
    value,
  }) {
    return (
      <div className="glass p-6 rounded-xl">
  
        <h3 className="text-gray-400">
          {title}
        </h3>
  
        <p className="text-4xl font-bold mt-4">
          {value}
        </p>
  
      </div>
    );
  }