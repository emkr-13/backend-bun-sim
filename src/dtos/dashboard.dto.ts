import { IsEnum, IsOptional } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     SummaryGeneralDto:
 *       type: object
 *       properties:
 *         total_customers:
 *           type: integer
 *           description: Total number of customers
 *         total_suppliers:
 *           type: integer
 *           description: Total number of suppliers
 *         total_stores:
 *           type: integer
 *           description: Total number of stores
 *         total_products:
 *           type: integer
 *           description: Total number of products
 */
export class SummaryGeneralDto {
  total_customers!: number;
  total_suppliers!: number;
  total_stores!: number;
  total_products!: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     TimeFilterType:
 *       type: string
 *       enum: [today, last_week, last_two_weeks, this_month]
 *       description: Time filter for summary data
 */
export type TimeFilterType =
  | "today"
  | "last_week"
  | "last_two_weeks"
  | "this_month";

/**
 * @swagger
 * components:
 *   schemas:
 *     SummarySpecificFilterDto:
 *       type: object
 *       properties:
 *         time_filter:
 *           $ref: '#/components/schemas/TimeFilterType'
 */
export class SummarySpecificFilterDto {
  @IsOptional()
  @IsEnum(["today", "last_week", "last_two_weeks", "this_month"], {
    message:
      "time_filter must be one of: today, last_week, last_two_weeks, this_month",
  })
  time_filter?: TimeFilterType;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SummarySpecificDto:
 *       type: object
 *       properties:
 *         total_quotations:
 *           type: integer
 *           description: Total number of quotations
 *         total_purchases:
 *           type: integer
 *           description: Total number of purchases
 *         total_stock_movements_in:
 *           type: integer
 *           description: Total number of stock movements (in)
 *         total_stock_movements_out:
 *           type: integer
 *           description: Total number of stock movements (out)
 *         time_filter:
 *           $ref: '#/components/schemas/TimeFilterType'
 */
export class SummarySpecificDto {
  total_quotations!: number;
  total_purchases!: number;
  total_stock_movements_in!: number;
  total_stock_movements_out!: number;
  time_filter!: TimeFilterType;
}
