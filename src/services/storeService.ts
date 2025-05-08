import { IStoreRepository } from "../repositories/storeRepository";
import logger from "../utils/logger";
import { pagination } from "../utils/helper";

export class StoreService {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async createStore(data: {
    name: string;
    description?: string;
    location?: string;
    manager?: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) {
    if (!data.name) {
      throw new Error("name is required");
    }

    if (await this.storeRepository.storeExistsByName(data.name)) {
      throw new Error("Store with this name already exists");
    }

    await this.storeRepository.createStore(data);
    logger.info("Store created successfully");
  }

  async updateStore(
    id: number,
    data: {
      name?: string;
      description?: string;
      location?: string;
      manager?: string;
      contactInfo?: string;
      phone?: string;
      email?: string;
      address?: string;
    }
  ) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.storeRepository.storeExistsById(id))) {
      throw new Error("Store not found");
    }

    if (
      data.name &&
      (await this.storeRepository.storeExistsByName(data.name))
    ) {
      const existingStore = await this.storeRepository.getStoreById(id);
      if (existingStore.name !== data.name) {
        throw new Error("Another store with this name already exists");
      }
    }

    await this.storeRepository.updateStore(id, data);
    logger.info("Store updated successfully");
  }

  async deleteStore(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.storeRepository.storeExistsById(id))) {
      throw new Error("Store not found");
    }

    await this.storeRepository.deleteStore(id);
    logger.info("Store deleted successfully");
  }

  async getStoreDetail(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    const store = await this.storeRepository.getStoreById(id);
    if (!store) {
      throw new Error("Store not found");
    }

    logger.info("Store details retrieved successfully");
    return store;
  }

  async listStores(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const result = await this.storeRepository.listStores(options);
    const paginationResult = pagination(
      result.total,
      options.page,
      options.limit
    );

    logger.info("Stores retrieved successfully");
    return {
      data: result.data,
      pagination: paginationResult,
    };
  }
}
