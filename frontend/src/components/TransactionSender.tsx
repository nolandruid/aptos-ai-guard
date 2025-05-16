import { TransactionForm } from "./TransactionForm";
import { Header } from "./Header";

export const TransactionSender = () => {
  return (
    <section className="relative py-8 min-h-screen bg-linear-to-b/decreasing from-indigo-500 to-teal-400">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/pattern.svg')] bg-repeat opacity-50"
      />
      <Header />
      <TransactionForm />
    </section>
  );
};
