import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface JwtResponse {
  success: boolean;
  token?: string; // Token bersifat opsional karena hanya ada jika success = true
}

interface PaginationResponse {
  total_data: number;
  total_page: number;
  total_display: number;
  first_page: boolean;
  last_page: boolean;
  prev: number;
  current: number;
  next: number;
  detail: number[];
}

/**
 * Menghasilkan JWT token untuk autentikasi.
 * @param payload - Data yang akan disisipkan ke dalam token.
 * @returns Promise<JwtResponse> - Objek dengan status sukses dan token (jika berhasil).
 */
async function generateJwtToken(payload: object): Promise<JwtResponse> {
  try {
    const rawToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.AUTH_TOKEN_EXP!, 10),
    });

    return {
      success: true,
      token: rawToken,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

/**
 * Menghasilkan refresh token untuk autentikasi.
 * @param payload - Data yang akan disisipkan ke dalam token.
 * @returns Promise<JwtResponse> - Objek dengan status sukses dan token (jika berhasil).
 */
async function generateRefreshToken(payload: object): Promise<JwtResponse> {
  try {
    const rawToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXP!, 10),
    });

    return {
      success: true,
      token: rawToken,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

/**
 * Menghitung paginasi untuk halaman tertentu.
 * @param total - Total jumlah data.
 * @param pagenum - Halaman saat ini.
 * @param limit - Jumlah data per halaman.
 * @returns Promise<PaginationResponse> - Objek yang berisi detail paginasi.
 */

async function pagination(
  total: number,
  pagenum: number,
  limit: number
): Promise<PaginationResponse> {
  try {
    let total_page = Math.ceil(total / limit);
    let prev = pagenum - 1;
    if (prev < 1) {
      prev = 0;
    }
    let next = pagenum + 1;
    if (next > total_page) {
      next = 0;
    }
    let from = 1;
    let to = total_page;
    let to_page = pagenum - 2;
    if (to_page > 0) {
      from = to_page;
    }
    if (total_page >= 5) {
      if (total_page > 0) {
        to = 5 + to_page;
        if (to > total_page) {
          to = total_page;
        }
      } else {
        to = 5;
      }
    }
    let firstpage_istrue = false;
    let lastpage_istrue = false;
    let detail: number[] = [];
    if (total_page > 1) {
      for (let i = from; i <= to; i++) {
        detail.push(i);
      }
      if (from !== 1) {
        firstpage_istrue = true;
      }
      if (to !== total_page) {
        lastpage_istrue = true;
      }
    }
    let total_display = limit;
    if (next === 0) {
      if (total % limit !== 0) {
        total_display = total % limit;
      }
      if (total_page < pagenum) {
        total_display = 0;
      }
    }
    const pagination: PaginationResponse = {
      total_data: total,
      total_page: total_page,
      total_display: total_display,
      first_page: firstpage_istrue,
      last_page: lastpage_istrue,
      prev: prev,
      current: pagenum,
      next: next,
      detail: detail,
    };
    return pagination;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export { generateJwtToken, generateRefreshToken, pagination };
