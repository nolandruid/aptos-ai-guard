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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl p-6 shadow max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Send Aptos Tokens</h2>

      <div className="bg-gray-100 rounded p-4 mb-4">
        <p className="text-sm text-gray-600">You are sending from:</p>
        <p className="text-sm font-mono text-blue-600">
          {address ? `${address.slice(0, 8)}...${address.slice(-4)}` : "—"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">
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
          className="w-full border px-3 py-2 rounded"
        />
        {errors.destinationAddress && (
          <span className="text-red-500 text-sm">
            {errors.destinationAddress.message}
          </span>
        )}

        {score !== null && <TrustLevelSlider riskScore={score} />}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Amount to Send</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.001, message: "Amount must be greater than 0" },
          })}
          placeholder="1.5"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.amount && (
          <span className="text-red-500 text-sm">{errors.amount.message}</span>
        )}
      </div>

      <div className="bg-green-100 text-green-700 rounded p-4 mb-4">
        <p className="font-semibold">Receiver gets</p>
        <p className="text-2xl font-bold">
          {cadValue === null ? "—" : `${cadValue.toFixed(2)} CAD`}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Now
      </button>
    </form>
  );
};
