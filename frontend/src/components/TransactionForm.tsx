import { useWalletStore } from "../store/walletStore";
import { useTransactionForm } from "../hooks/";
import { TrustLevelSlider } from "./TrustLevelSlider";
import { useConfidenceScoreStore } from "../store/confindenceScoreStore";
import { useMoneyConversionStore } from "../store/moneyConversionStore";

type FormValues = {
  destinationAddress: string;
  amount: number;
};

export const TransactionForm = () => {
  const { address } = useWalletStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    onSubmit,
    amount,
  } = useTransactionForm();

  const { cadValue } = useMoneyConversionStore()
  const { score } = useConfidenceScoreStore()

  if (!address) {
    return (
      <div className="p-4 text-red-600 font-medium">
        Wallet not connected. Please connect Petra Wallet.
      </div>
    );
  }

  return (
    <section className="relative my-30">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface  rounded-xl p-6 shadow-lg max-w-md mx-auto   bg-linear-to-b from-white/80 from-60% to-white-400/80"
    >
      <div className="mb-4">
        <label className="font-inter text-primary-light text-md font-bold">
        You are sending from:
        </label>
        <input
          value={address ? `${address.slice(0, 8)}...${address.slice(-4)}` : "—"}
          placeholder="0xabc123..."
          className="font-inter text-md w-full border px-3 py-2 rounded mt-2 border-none focus:border-none bg-gray-100 shadow-sm text-gray-500"
          disabled
        />

      </div>

      <div className="mb-4">
        <label className="font-inter text-primary-light text-md font-bold">
          Recipient Wallet Address
        </label>
        <input
          {...register("destinationAddress", {
            required: "Address is required",
            validate: (value) =>
              value.startsWith("0x") && value.length >= 32
                ? true
                : "Invalid address format",
          })}
          placeholder="0xabc123..."
          className="font-inter text-gray-500 text-md w-full border px-3 py-2 rounded mt-2 border-none focus:border-none bg-gray-100 shadow-sm "
        />
        {errors.destinationAddress && (
          <span className="text-red-500 text-sm">
            {errors.destinationAddress.message}
          </span>
        )}

        {score !== null && <TrustLevelSlider riskScore={score} />}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-bold font-inter text-primary-light">Amount to Send in APTs</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0, message: "Amount must be greater than 0" },
          })}
          placeholder="1.5"
          className="font-inter text-md w-full border px-3 py-2 rounded mt-2 border-none focus:border-none bg-gray-100 shadow-sm text-gray-500"
        />
        {errors.amount && (
          <span className="text-red-500 text-sm">{errors.amount.message}</span>
        )}
      </div>

      <div className="bg-gray-100 text-green-700 rounded p-4 mb-4">
        <p className="font-inter text-primary-light font-semibold">Receiver Gets</p>
        <p className="font-inter text-primary-light text-2xl font-bold">
          {cadValue === null ? "—" : `${amount} APT = ${cadValue.toFixed(2)} CAD`}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-accent hover:bg-accent-pale text-primary-black font-semibold px-6 py-3 rounded shadow transition  text-btn-text duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Now
      </button>
    </form>
    </section>
  );
};
