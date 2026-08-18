import { Injectable } from '@angular/core';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { accountInfo, lang } from '../context/global';
import { myAxios } from './myAxios';

@Injectable({ providedIn: 'root' })
export class ApiService {
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return myAxios.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: accountInfo()
          ? `Bearer ${accountInfo()?.token}`
          : undefined,
        'Accept-Language': lang(),
      },
    });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return myAxios.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: accountInfo()
          ? `Bearer ${accountInfo()?.token}`
          : undefined,
        'Accept-Language': lang(),
      },
    });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return myAxios.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: accountInfo()
          ? `Bearer ${accountInfo()?.token}`
          : undefined,
        'Accept-Language': lang(),
      },
    });
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return myAxios.delete<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: accountInfo()
          ? `Bearer ${accountInfo()?.token}`
          : undefined,
        'Accept-Language': lang(),
      },
    });
  }

  isAxiosError(error: unknown): boolean {
    return axios.isAxiosError(error);
  }
}
