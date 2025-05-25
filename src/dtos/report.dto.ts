import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum DateFilterType {
  TODAY = "today",
  THIS_WEEK = "this_week",
  THIS_MONTH = "this_month",
  CUSTOM = "custom",
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportFilterDto:
 *       type: object
 *       properties:
 *         filterType:
 *           type: string
 *           enum: [today, this_week, this_month, custom]
 *           description: Date filter type
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date for custom date range (required if filterType is custom)
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date for custom date range (required if filterType is custom)
 *         title:
 *           type: string
 *           description: Custom title for the report
 */
export class ReportFilterDto {
  @IsEnum(DateFilterType)
  filterType!: DateFilterType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
