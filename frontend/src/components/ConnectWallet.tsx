import { usePetra } from "../hooks/usePetra";

export const ConnectWallet = () => {
  const { connect } = usePetra();

  return (
    <section className="relative py-20 min-h-screen bg-linear-to-b/decreasing from-indigo-500 to-teal-400">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/pattern.svg')] bg-repeat opacity-50"
      />

      {/* Contenido centrado y responsivo */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center gap-8 text-center">
        <h1 className="font-satoshi text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
          <span className="font-bold">AptosAI Guard</span> checks wallet trust
          <br className="hidden sm:block" />
          with AI before you send APT
        </h1>

        <p className="font-inter text-base sm:text-lg font-light max-w-2xl text-white leading-relaxed">
          Before you send, AptosAI Guard scans wallet history, behavior, and
          patterns to detect red flags. It’s fast, smart, and gives you peace of
          mind in seconds
        </p>

        <button
          onClick={connect}
          className="bg-accent hover:bg-accent-pale text-primary-black font-semibold px-6 py-3 rounded shadow transition  text-btn-text duration-200"
        >
          Connect Petra Wallet
        </button>
      </div>

      <img
        src="/images/iphone2.png"
        alt="iPhone Mockup"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[16  00px] sm:w-[1600px] lg:w-[1600px] z-1"
      />
    </section>
  );
};
