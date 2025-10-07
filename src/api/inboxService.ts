// src/api/inboxService.ts

// 🌍 Environment Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN || '';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '15000', 10);
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG === 'true';

// 🔍 Environment Validation
const validateEnvironment = () => {
  const missingVars: string[] = [];
  
  if (!API_BASE_URL) missingVars.push('NEXT_PUBLIC_API_BASE_URL');
  if (!API_AUTH_TOKEN) missingVars.push('NEXT_PUBLIC_API_AUTH_TOKEN');
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file.'
    );
  }
};

// 🛠️ Utility Functions
const createHeaders = (): Record<string, string> => {
  validateEnvironment();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_AUTH_TOKEN}`,
  };
  
  if (DEBUG_MODE) {
    console.log('🔑 Headers created:', {
      hasAuthorization: !!headers['Authorization'],
      tokenLength: API_AUTH_TOKEN.length,
      tokenPreview: `${API_AUTH_TOKEN.substring(0, 8)}...`,
    });
  }
  
  return headers;
};

// 🔍 Debug Function แสดงค่า Environment
const logEnvironmentInfo = () => {
  if (DEBUG_MODE) {
    console.log('🔍 Environment Info:', {
      baseUrl: API_BASE_URL,
      hasToken: !!API_AUTH_TOKEN,
      tokenPreview: API_AUTH_TOKEN ? `${API_AUTH_TOKEN.substring(0, 8)}...` : 'No token',
      timeout: API_TIMEOUT,
      nodeEnv: process.env.NODE_ENV,
      isClient: typeof window !== 'undefined'
    });
  }
};

const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  
  try {
    const errorData = await response.json();
    if (errorData.message) {
      errorMessage += ` - ${errorData.message}`;
    }
  } catch (parseError) {
    if (DEBUG_MODE) {
      console.warn('Failed to parse error response:', parseError);
    }
  }
  
  throw new Error(`เกิดข้อผิดพลาดจาก API: ${errorMessage}`);
};

const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    // ✅ Log ข้อมูลก่อนส่ง request
    if (DEBUG_MODE) {
      console.log('🚀 API Request:', {
        url,
        method: options.method,
        headers: options.headers,
        hasBody: !!options.body
      });
    }
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('การเชื่อมต่อ API หมดเวลา (Timeout)');
    }
    
    throw error;
  }
};

// 📝 Type Definitions
export interface ApiWorkListItem {
  workListId: number;
  workJobId: number;
  priority: string | null;
  jobStatus: string | null;
  createBy: string | null;
  createDate: string | null;
  fileName: string | null;
  endrEffectiveDate: string | null;
  edasDocStatus: string | null;
  taskNo: string;
  policyNo: string;
  endrCode: string;
  endrDesc: string;
  team: string;
  clientName: string | null;
  endrCreateBy: string | null;
  assigneeId: string | null;
  acquirerId: string | null;
  endrCreateDate: string;
  jobAssignDate: string | null;
}

export interface ApiWorkItem {
  viewNo: string;
  viewName: string;
  count: number;
  groupName: string;
}

export interface ApiNavItem {
  viewno: string;
  menugroup: string;
  id: string;
  label: string;
  cntjob: number;
  priority: string | number | null;
}

// 🌐 API Functions
export const getWorkMenu = async (): Promise<ApiWorkItem[]> => {
  logEnvironmentInfo();
  
  if (DEBUG_MODE) {
    console.log('🔗 Fetching work menu from:', `${API_BASE_URL}/get-work`);
  }
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/get-work`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('📋 Work menu response:', data);
    }
    
    return data;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('❌ getWorkMenu error:', error);
    }
    throw error;
  }
};

export const getNavMenuData = async (): Promise<ApiNavItem[]> => {
  logEnvironmentInfo();
  
  if (DEBUG_MODE) {
    console.log('🔗 Fetching nav menu from:', `${API_BASE_URL}/get-work`);
  }
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/get-work`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('🗂️ Nav menu response:', data);
    }
    
    return data;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('❌ getNavMenuData error:', error);
    }
    throw error;
  }
};

export const getWorkList = async (viewNo: string): Promise<ApiWorkListItem[]> => {
  logEnvironmentInfo();
  
  if (DEBUG_MODE) {
    console.log('🔗 Fetching work list from:', `${API_BASE_URL}/get-work-list`);
    console.log('📊 Request payload:', { viewNo });
  }
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/get-work-list`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ viewNo }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('📋 Work list response:', data);
      console.log('📊 Total items:', data?.length || 0);
    }
    
    return data as ApiWorkListItem[];
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('❌ getWorkList error:', error);
    }
    throw error;
  }
};

// 🔍 Debug Helper (Development Only)
export const getApiConfig = () => {
  if (DEBUG_MODE) {
    return {
      baseUrl: API_BASE_URL,
      timeout: API_TIMEOUT,
      hasToken: !!API_AUTH_TOKEN,
      tokenPreview: API_AUTH_TOKEN ? `${API_AUTH_TOKEN.substring(0, 8)}...` : 'No token',
      environment: process.env.NODE_ENV,
    };
  }
  return null;
};

// 🧪 Health Check Function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: createHeaders(),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    if (DEBUG_MODE) {
      console.error('API Health Check Failed:', error);
    }
    return false;
  }
};

// 🔧 Environment Variables Validation Function (Export for testing)
export const validateApiConfiguration = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!API_BASE_URL) {
    errors.push('NEXT_PUBLIC_API_BASE_URL is missing');
  } else if (!API_BASE_URL.startsWith('http')) {
    warnings.push('NEXT_PUBLIC_API_BASE_URL should start with http or https');
  }
  
  if (!API_AUTH_TOKEN) {
    errors.push('NEXT_PUBLIC_API_AUTH_TOKEN is missing');
  } else if (API_AUTH_TOKEN.length < 10) {
    warnings.push('NEXT_PUBLIC_API_AUTH_TOKEN seems too short');
  }
  
  if (isNaN(API_TIMEOUT) || API_TIMEOUT <= 0) {
    warnings.push('NEXT_PUBLIC_API_TIMEOUT should be a positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
