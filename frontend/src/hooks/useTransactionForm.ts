import { useForm } from "react-hook-form";
import { verifyRisk } from "../service/verifyRisk";
import { getAptosToCad } from "../service/getAptosToCad";
import { useConfidenceScoreStore } from "../store/confindenceScoreStore";
import { useMoneyConversionStore } from "../store/moneyConversionStore";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";

export const useTransactionForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    reset,
    
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const [isFormLoading, setIsFormLoading] = useState(false)
  const [isRiskLoading, setIsRiskLoading] = useState(false)

  const { setScore } = useConfidenceScoreStore()
  const { setCadValue, setAptAmount } = useMoneyConversionStore()

  const rawAmount = watch("amount") || "0";
  const amount = parseFloat(rawAmount.toString());

  const onSubmit = () => {
    setIsFormLoading(true)
    setTimeout(() => {
      setCadValue(null)
      setAptAmount(null)
      setScore(null)
      reset();
      setIsFormLoading(false)
      toast.success('Transaction sent successfully');
    }, 2000); 
  };

  // const onValidateRiskScoreDebounced = useDebouncedCallback(
  //   async (value) => {
  //     const risk = await verifyRisk({ addressWallet: value });
  //     setScore(risk.confidenceScore)
  //     setValue("destinationAddress", value, { shouldValidate: true, shouldDirty: true });
  //   },
  //   1000
  // );

  const onValidateRiskScoreDebounced = useDebouncedCallback(
    async (value: string) => {
      const trimmed = value.trim();
  
      const isValidAddress = /^0x[a-fA-F0-9]{64}$/.test(trimmed);
  
      if (!isValidAddress) return;
  
      setIsRiskLoading(true);
  
      setTimeout(async () => {
        try {
          const risk = await verifyRisk({ addressWallet: trimmed });
          setScore(risk.confidenceScore);
          setValue("destinationAddress", trimmed, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } catch (error) {
          console.error("Error verifying risk:", error);
        } finally {
          setIsRiskLoading(false);
        }
      }, 1000);   
    },
    500
  );
 
 
 
  const onCadConversionDebounced = useDebouncedCallback(
    async (value) => {
      const cadConversion = await getAptosToCad(value);
      setAptAmount(value)
      setCadValue(cadConversion.cadValue)
      setValue("amount", value, { shouldValidate: true, shouldDirty: true });
    },
    1000
  );

  return {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    rawAmount,
    amount,
    onSubmit,
    onValidateRiskScoreDebounced,
    onCadConversionDebounced,
    isFormLoading,
    isRiskLoading,
  };
};
