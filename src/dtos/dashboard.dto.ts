import { IsEnum, IsOptional } from "class-validator";


export class SummaryGeneralDto {
  total_customers!: number;
  total_suppliers!: number;
  total_stores!: number;
  total_products!: number;
}

export type TimeFilterType =
  | "today"
  | "last_week"
  | "last_two_weeks"
  | "this_month";


export class SummarySpecificFilterDto {
  @IsOptional()
  @IsEnum(["today", "last_week", "last_two_weeks", "this_month"], {
    message:
      "time_filter must be one of: today, last_week, last_two_weeks, this_month",
  })
  time_filter?: TimeFilterType;
}


export class SummarySpecificDto {
  total_quotations!: number;
  total_purchases!: number;
  total_stock_movements_in!: number;
  total_stock_movements_out!: number;
  time_filter!: TimeFilterType;
}
