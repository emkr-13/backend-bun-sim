import { IAkunRepository } from "../repositories/akunRepository";
import logger from "../utils/logger";
import { pagination } from "../utils/helper";

export class AkunService {
  constructor(private readonly akunRepository: IAkunRepository) {}

  async createAkun(data: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    type: "customer" | "supplier";
  }) {
    if (!data.name) {
      throw new Error("name is required");
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Invalid email format");
      }

      if (await this.akunRepository.akunExistsByEmail(data.email)) {
        throw new Error("Akun with this email already exists");
      }
    }

    if (!["customer", "supplier"].includes(data.type)) {
      throw new Error("Invalid type");
    }

    await this.akunRepository.createAkun(data);
    logger.info("Akun created successfully");
  }

  async updateAkun(
    id: number,
    data: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      type?: "customer" | "supplier";
    }
  ) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.akunRepository.akunExistsById(id))) {
      throw new Error("Akun not found");
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Invalid email format");
      }
    }

    if (data.type && !["customer", "supplier"].includes(data.type)) {
      throw new Error("Invalid type");
    }

    await this.akunRepository.updateAkun(id, data);
    logger.info("Akun updated successfully");
  }

  async deleteAkun(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.akunRepository.akunExistsById(id))) {
      throw new Error("Akun not found");
    }

    await this.akunRepository.softDeleteAkun(id);
    logger.info("Akun deleted successfully");
  }

  async getAkunDetail(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    const akun = await this.akunRepository.getAkunById(id);
    if (!akun) {
      throw new Error("Akun not found");
    }

    logger.info("Akun details retrieved successfully");
    return akun;
  }

  async listAkuns(options: {
    page: number;
    limit: number;
    search?: string;
    type?: "customer" | "supplier";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const result = await this.akunRepository.listAkuns(options);
    const paginationResult = await pagination(
      result.total,
      options.page,
      options.limit
    );

    logger.info("Akuns retrieved successfully");
    return {
      data: result.data,
      pagination: paginationResult,
    };
  }
}
