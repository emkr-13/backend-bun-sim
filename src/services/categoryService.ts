import { ICategoryRepository } from "../repositories/categoryRepository";
import logger from "../utils/logger";
import { pagination } from "../utils/helper";

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async createCategory(name: string, description?: string) {
    if (!name) {
      throw new Error("name is required");
    }

    if (await this.categoryRepository.categoryExists(name)) {
      throw new Error("Category already exists");
    }

    await this.categoryRepository.createCategory({ name, description });
    logger.info("Category created successfully");
  }

  async updateCategory(id: number, name?: string, description?: string) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.categoryRepository.categoryExistsById(id))) {
      throw new Error("Category not found");
    }

    await this.categoryRepository.updateCategory(id, { name, description });
    logger.info("Category updated successfully");
  }

  async deleteCategory(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    if (!(await this.categoryRepository.categoryExistsById(id))) {
      throw new Error("Category not found");
    }

    await this.categoryRepository.softDeleteCategory(id);
    logger.info("Category deleted successfully");
  }

  async getCategoryDetail(id: number) {
    if (!id) {
      throw new Error("id is required");
    }

    const category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    logger.info("Category details retrieved successfully");
    return category;
  }

  async listCategories(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const result = await this.categoryRepository.listCategories(options);
    const paginationResult = await pagination(
      result.total,
      options.page,
      options.limit
    );

    logger.info("Categories retrieved successfully");
    return {
      data: result.data,
      pagination: paginationResult,
    };
  }
}
