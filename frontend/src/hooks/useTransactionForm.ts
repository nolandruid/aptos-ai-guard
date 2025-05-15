import { useForm } from "react-hook-form";
import { verifyRisk } from "../service/verifyRisk";

export const useTransactionForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const rawAmount = watch("amount") || "0";
  const amount = parseFloat(rawAmount.toString());
  const estimatedReceive = amount * 3;

  const onSubmit = async (data: FormValues) => {
    const risk = await verifyRisk({ addressWallet: data.destinationAddress });
    console.log("🚀 Risk:", risk);
  };

  return {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    rawAmount,
    amount,
    estimatedReceive,
    onSubmit,
  };
};
