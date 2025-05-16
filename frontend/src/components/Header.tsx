import { usePetra } from "../hooks/usePetra";

export const Header = () => {
      const { disconnect } = usePetra();
    return (
      <header className="bg-transparent text-white flex justify-between items-center px-10">
        <div className="flex items-center gap-2">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg> */}
          <h1 className="font-satoshi text-xl font-bold">AptosAI Guard</h1>
        </div>
  
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent">
            <img
              src="/images/avatar.jpg"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
  
          <div className="h-8 border-l border-white border-1 opacity-80" />
  
          <button
          className="font-inter text-base font-medium text-white hover:text-accent cursor-pointer"
            onClick={() => {
              disconnect();
            }}
            
          >
            Disconnect
          </button>
        </div>
      </header>
    );
  };
  