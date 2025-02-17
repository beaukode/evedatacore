import { z } from "zod";
import { AbiTypeDetails } from "./parseAbiType";

function bigintValidator(value: z.ZodString, min: bigint, max: bigint) {
  return value
    .transform((value) => {
      return BigInt(value);
    })
    .refine((value) => value >= min, {
      message: `Value must be greater than or equal to ${min}`,
    })
    .refine((value) => value <= max, {
      message: `Value must be lesser than or equal to ${max}`,
    });
}

function wrapIntoArrayValuePreprocess(value: z.ZodTypeAny) {
  return z.preprocess(
    (v: unknown) => (typeof v === "object" && v && "value" in v ? v.value : v),
    value
  );
}

export function abiTypeZodSchema(abiType: AbiTypeDetails): z.ZodSchema {
  if (abiType.isArray) {
    return z.array(
      // There is a limitation when using react-hook-form useFieldArray
      // that the value must be an object
      wrapIntoArrayValuePreprocess(
        abiTypeZodSchema({ ...abiType, isArray: false })
      )
    );
  }

  switch (abiType.baseType) {
    case "uint": {
      const max = 2n ** BigInt(abiType.length || 0) - 1n;
      return bigintValidator(
        z.string().min(1, { message: "Required" }),
        0n,
        max
      );
    }
    case "int": {
      const min = (-2n) ** BigInt(abiType.length ? abiType.length - 1 : 0);
      const max = 2n ** BigInt(abiType.length ? abiType.length - 1 : 0) - 1n;
      return bigintValidator(
        z.string().min(1, { message: "Required" }),
        min,
        max
      );
    }
    case "bool":
      return z.coerce.boolean();
    case "address":
      return z
        .string()
        .length(40)
        .transform((value) => `0x${value}`);
    case "bytes": {
      if (abiType.length) {
        return z
          .string()
          .length(abiType.length * 2)
          .transform((value) => `0x${value}`);
      }
      return z
        .string()
        .min(1, { message: "Required" })
        .transform((value) => `0x${value}`);
    }
    case "string":
      return z.string().default("");
  }
}
