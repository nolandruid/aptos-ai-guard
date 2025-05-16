import { usePetra } from "../hooks/usePetra";

export const ConnectWallet = () => {
  const { connect } = usePetra();

  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-black to-green-950">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="font-satoshi text-6xl font-light text-left text-white">
            <span className="font-bold">AptosAI Guard</span> checks wallet trust{" "}
            <br />
            with AI before you send APT
          </h1>
          <p className="font-inter text-left text-lg font-light max-w-3xl text-white">
            Connect your Petra Wallet, enter the recipient’s address and amount,
            and let AptosAI Guard scan the blockchain for activity patterns,
            transaction history, and wallet behavior. Our ML model evaluates the
            risk and gives you a clear warning if something feels off
          </p>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={connect}
            >
              Connect Petra Wallet
            </button>
          </div>
        </div>
        <div className="flex justify-end"></div>
      </div>
    </section>
  );
};
