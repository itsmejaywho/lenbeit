"use client";

import { useRef, useState } from "react";

export type FieldValidator = (value: string) => string | null;

export function useFormField(validate: FieldValidator, initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [validAfterBlur, setValidAfterBlur] = useState(false);
  const validateOnChange = useRef(false);
  const submittedWithError = useRef(false);

  function handleChange(nextValue: string) {
    setValue(nextValue);
    setValidAfterBlur(false);
    if (!validateOnChange.current) return;

    if (!nextValue.trim() && !submittedWithError.current) {
      setError(null);
      validateOnChange.current = false;
      return;
    }

    const nextError = validate(nextValue);
    setError(nextError);
    if (!nextError) {
      validateOnChange.current = false;
      submittedWithError.current = false;
    }
  }

  function handleBlur() {
    setValidAfterBlur(false);
    if (!value.trim()) {
      if (!submittedWithError.current) {
        setError(null);
        validateOnChange.current = false;
      }
      return;
    }

    const nextError = validate(value);
    setError(nextError);
    setValidAfterBlur(nextError === null);
    validateOnChange.current = nextError !== null;
    submittedWithError.current = false;
  }

  function validateForSubmit() {
    const nextError = validate(value);
    setError(nextError);
    if (nextError) {
      setValidAfterBlur(false);
      validateOnChange.current = true;
      submittedWithError.current = true;
    } else {
      validateOnChange.current = false;
      submittedWithError.current = false;
    }
    return nextError;
  }

  function revalidateWith(validator: FieldValidator) {
    if (!value.trim()) return null;
    const nextError = validator(value);
    setError(nextError);
    setValidAfterBlur(false);
    validateOnChange.current = nextError !== null;
    submittedWithError.current = false;
    return nextError;
  }

  return {
    value,
    error,
    validAfterBlur,
    handleChange,
    handleBlur,
    validateForSubmit,
    revalidateWith,
  };
}
