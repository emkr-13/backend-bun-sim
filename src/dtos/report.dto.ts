import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum DateFilterType {
  TODAY = "today",
  THIS_WEEK = "this_week",
  THIS_MONTH = "this_month",
  CUSTOM = "custom",
}

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
