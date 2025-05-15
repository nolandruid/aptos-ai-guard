
import { usePetra } from "../hooks/usePetra";
import { TransactionForm } from "./TransactionForm";

export const TransactionSender = () => {
  const { disconnect } = usePetra();


  return (
    <>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onClick={() => disconnect()}>Disconnect</button>
      <TransactionForm />
    </>
  );
};
