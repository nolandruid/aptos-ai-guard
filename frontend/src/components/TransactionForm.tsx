import { useForm } from "react-hook-form"
import { useWalletStore } from "../store/walletStore"

type FormValues = {
  recipient: string
  amount: number
}

export const TransactionForm = () => {
  const { address } = useWalletStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
  })

  const rawAmount = watch("amount") || "0"
  const amount = parseFloat(rawAmount.toString())
  const estimatedReceive = amount * 3 // Simulación

  const onSubmit = async (data: FormValues) => {
    console.log("🚀 Sending tokens:", data)
  }

  if (!address) {
    return (
      <div className="p-4 text-red-600 font-medium">
        Wallet not connected. Please connect Petra Wallet.
      </div>
    )
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
          {...register("recipient", {
            required: "Address is required",
            validate: (value) =>
              value.startsWith("0x") && value.length >= 32
                ? true
                : "Invalid address format",
          })}
          placeholder="0xabc123..."
          className="w-full border px-3 py-2 rounded"
        />
        {errors.recipient && (
          <span className="text-red-500 text-sm">
            {errors.recipient.message}
          </span>
        )}
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
          {isNaN(estimatedReceive)
            ? "—"
            : `${estimatedReceive.toFixed(4)} APT`}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Now
      </button>
    </form>
  )
}
