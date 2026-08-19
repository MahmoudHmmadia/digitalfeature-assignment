import { Injectable } from '@angular/core';
import type { AxiosResponse } from 'axios';
import { myAxios } from './myAxios';
import { accountInfo, lang } from '../context/global';
import type {
  LoginDto,
  RegisterDto,
  VerifyOtpDto,
  RequestNewCodeDto,
  ResetPasswordDto,
  AuthAccountResponse,
} from '../types/auth';

interface ApiMessage {
  message: string;
}

interface ApiData<T> {
  materials: T;
  message?: string;
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    'Accept-Language': lang(),
  };

  const account = accountInfo();
  if (account?.token) {
    h['Authorization'] = `Bearer ${account.token}`;
  }

  return h;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  login(dto: LoginDto): Promise<AxiosResponse<ApiData<AuthAccountResponse>>> {
    return myAxios.post('/auth/login', dto, { headers: headers() });
  }

  register(dto: RegisterDto): Promise<AxiosResponse<ApiMessage>> {
    return myAxios.post('/auth/register', dto, { headers: headers() });
  }

  checkCode(dto: VerifyOtpDto): Promise<AxiosResponse<ApiData<AuthAccountResponse>>> {
    return myAxios.post('/auth/check-code', dto, { headers: headers() });
  }

  requestNewCode(dto: RequestNewCodeDto): Promise<AxiosResponse<ApiMessage>> {
    return myAxios.post('/auth/new-code', dto, { headers: headers() });
  }

  resetPassword(dto: ResetPasswordDto): Promise<AxiosResponse<ApiMessage>> {
    return myAxios.post('/auth/reset-password', dto, { headers: headers() });
  }

  logout(): Promise<AxiosResponse<ApiMessage>> {
    return myAxios.post('/auth/logout', {}, { headers: headers() });
  }
}
