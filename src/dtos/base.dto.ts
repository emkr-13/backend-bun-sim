import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

export class BaseDto {
  static async validate<T extends object>(
    dto: new () => T,
    obj: Record<string, any>
  ): Promise<{ isValid: boolean; dto?: T; errors?: ValidationError[] }> {
    try {
      const dtoInstance = plainToInstance(dto, obj);
      const errors = await validate(dtoInstance as object);

      if (errors.length > 0) {
        return {
          isValid: false,
          errors,
        };
      }

      return {
        isValid: true,
        dto: dtoInstance,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            property: "unknown",
            constraints: {
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown validation error",
            },
            children: [],
          },
        ],
      };
    }
  }
}
