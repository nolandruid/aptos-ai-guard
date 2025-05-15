import { useForm } from "react-hook-form";

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
    console.log("🚀 Sending tokens:", data);
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
