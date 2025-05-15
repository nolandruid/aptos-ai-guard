import { useForm } from "react-hook-form";
import { verifyRisk } from "../service/verifyRisk";
import { getAptosToCad } from "../service/getAptosToCad";
import { mapToFiveScale } from "../utils/mappers";
import { useConfidenceScoreStore } from "../store/confindenceScoreStore";
import { useMoneyConversionStore } from "../store/moneyConversionStore";



export const useTransactionForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const { setScore } = useConfidenceScoreStore()
  const { setCadValue } = useMoneyConversionStore()

  const rawAmount = watch("amount") || "0";
  const amount = parseFloat(rawAmount.toString());

  const onSubmit = async (data: FormValues) => {
    const risk = await verifyRisk({ addressWallet: data.destinationAddress });
    const cadConversion = await getAptosToCad(amount);
    
    setScore(risk.confidenceScore)
    setCadValue(cadConversion.cadValue)
  };

  return {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    rawAmount,
    amount,
    onSubmit,
  };
};
