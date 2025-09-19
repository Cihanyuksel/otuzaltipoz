import { API_BASE_URL, AUTH_PATHS } from 'lib/config';

type FetchOptions = RequestInit & {
  _isRetry?: boolean;
};

export const apiFetch = async <T>(path: string, options: FetchOptions = {}): Promise<any> => {
  if (path !== AUTH_PATHS.REFRESH) {
    await ensureValidToken();
  }

  const config: FetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  let tokenToUse = null;

  if (config.headers && (config.headers as any)['Authorization']) {
    tokenToUse = (config.headers as any)['Authorization'];
  } else {
    const accessToken = (window as any).__accessToken;
    if (accessToken) {
      tokenToUse = `Bearer ${accessToken}`;
      config.headers = {
        ...config.headers,
        Authorization: tokenToUse,
      };
    }
  }

  let response = await fetch(`${API_BASE_URL}${path}`, config);

  if (response.status === 401 && !options._isRetry && path !== AUTH_PATHS.REFRESH) {
    const refreshTokenFn = (window as any).__refreshToken;
    if (refreshTokenFn) {
      const refreshSuccess = await refreshTokenFn();

      if (refreshSuccess) {
        const newAccessToken = (window as any).__accessToken;
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        config._isRetry = true;

        response = await fetch(`${API_BASE_URL}${path}`, config);
      } else {
        let message = 'Authentication failed - please login again';
        try {
          const errorData = await response.json().catch(() => null);
          if (errorData?.message) {
            message = errorData.message;
          }
        } catch {}
        const error = new Error(message);
        (error as any).status = 401;
        throw error;
      }
    } else {
      let message = 'Authentication failed - please login again';
      try {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          message = errorData.message;
        }
      } catch {}
      const error = new Error(message);
      (error as any).status = 401;
      throw error;
    }
  }

  if (!response.ok) {
    if (response.status === 404 && (path.includes('/photos/') || path.includes('/images/')) && (!config.method || config.method === 'GET')) {
      console.warn(`Resource not found (likely deleted): ${path}`);
      return { data: null, success: false, message: 'Resource not found' };
    }

    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }
    } catch (parseError) {
      console.warn('Could not parse error response:', parseError);
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};

const ensureValidToken = async (): Promise<void> => {
  const shouldRefreshToken = (window as any).__shouldRefreshToken;
  const refreshToken = (window as any).__refreshToken;

  if (shouldRefreshToken && refreshToken && shouldRefreshToken()) {
    await refreshToken();
  }
};

export default apiFetch;