import { useWalletStore } from "../store/walletStore";
import { useTransactionForm } from "../hooks/";
import { TrustLevelSlider } from "./TrustLevelSlider";
import { useConfidenceScoreStore } from "../store/confindenceScoreStore";
import { useMoneyConversionStore } from "../store/moneyConversionStore";
import { Toaster } from "react-hot-toast";

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
    onValidateRiskScoreDebounced,
    onCadConversionDebounced,
    isFormLoading,
    isRiskLoading,
  } = useTransactionForm();

  const { cadValue, aptAmount } = useMoneyConversionStore();
  const { score } = useConfidenceScoreStore();

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
            value={
              address ? `${address.slice(0, 8)}...${address.slice(-4)}` : "—"
            }
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
            onChange={(e) => onValidateRiskScoreDebounced(e.target.value)}
            placeholder="0xabc123..."
            className="font-inter text-gray-500 text-md w-full border px-3 py-2 rounded mt-2 border-none focus:border-none bg-gray-100 shadow-sm "
          />
          {errors.destinationAddress && (
            <span className="text-red-500 text-sm">
              {errors.destinationAddress.message}
            </span>
          )}

          {score !== null && !isRiskLoading && <TrustLevelSlider riskScore={score} />}
          {isRiskLoading && (
          
            <div className="flex items-center justify-center mt-4" role="status">
                <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold font-inter text-primary-light">
            Amount to Send in APTs
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0, message: "Amount must be greater than 0" },
            })}
            placeholder="1.5"
            className="font-inter text-md w-full border px-3 py-2 rounded mt-2 border-none focus:border-none bg-gray-100 shadow-sm text-gray-500"
            onChange={(e) => onCadConversionDebounced(e.target.value)}
          />
          {errors.amount && (
            <span className="text-red-500 text-sm">
              {errors.amount.message}
            </span>
          )}
        </div>

        <div className="bg-gray-100 text-green-700 rounded p-4 mb-4">
          <p className="font-inter text-primary-light font-semibold">
            Receiver Gets
          </p>
          <p className="font-inter text-primary-light text-2xl font-bold">
            {cadValue === null || isNaN(cadValue)
              ? "—"
              : `${aptAmount} APT = ${cadValue.toFixed(2)} CAD`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isFormLoading}
          className="w-full bg-accent hover:bg-accent-pale text-primary-black font-semibold px-6 py-3 rounded shadow transition  text-btn-text duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isFormLoading ? (
            <div className="flex items-center justify-center gap-2" role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            Processing...
          </div>
        ) : (
          "Send Transaction"
        )}
        </button>
      </form>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
        }}
      />
    </section>
  );
};
