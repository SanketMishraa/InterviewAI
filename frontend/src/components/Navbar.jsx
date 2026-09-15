export default function Navbar() {
    return (
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl">
  
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>
  
        <div className="flex items-center gap-3">
  
          <img
            src="https://ui-avatars.com/api/?name=Sanket"
            className="w-10 h-10 rounded-full"
          />
  
        </div>
  
      </div>
    );
  }