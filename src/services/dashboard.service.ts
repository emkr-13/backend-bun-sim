import { IDashboardRepository } from "../repositories/dashboard.repository";
import { TimeFilterType } from "../dtos/dashboard.dto";
import logger from "../utils/logger";

export class DashboardService {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async getSummaryGeneral() {
    try {
      const summary = await this.dashboardRepository.getSummaryGeneral();
      logger.info("Dashboard general summary retrieved successfully");
      return summary;
    } catch (error) {
      logger.error("Error retrieving dashboard general summary", error);
      throw new Error("Failed to retrieve dashboard general summary");
    }
  }

  async getSummarySpecific(timeFilter?: TimeFilterType) {
    try {
      const summary = await this.dashboardRepository.getSummarySpecific(
        timeFilter
      );
      logger.info(
        `Dashboard specific summary retrieved successfully with filter: ${
          timeFilter || "today"
        }`
      );
      return {
        ...summary,
        time_filter: timeFilter || "today",
      };
    } catch (error) {
      logger.error(
        `Error retrieving dashboard specific summary with filter: ${timeFilter}`,
        error
      );
      throw new Error("Failed to retrieve dashboard specific summary");
    }
  }
}
