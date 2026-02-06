# API Services - Quy Tắc và Hướng Dẫn

## Tổng Quan

API Services là lớp giao tiếp giữa ứng dụng React Native và backend API. Tất cả các API calls phải được thực hiện thông qua các service methods được định nghĩa trong thư mục `/app/services/api/`.

### Điểm Quan Trọng

- **API methods giờ THROW errors thay vì return error objects**
- Luôn sử dụng `try-catch` blocks khi gọi API
- Errors có type `GeneralApiProblem`
- Sử dụng `ApiEnvelope<T>` wrapper cho responses

---

## Cấu Trúc Thư Mục

```
app/services/api/
├── index.ts                    # Export chính, API class, singleton instances
├── types.ts                    # Shared types
├── apiProblem.ts              # Error handling utilities
│
├── Auth/
│   ├── AuthService.ts         # Auth service methods
│   └── AuthType.ts            # Auth-related types
│
├── Account/
│   ├── AccountService.ts      # Account service methods
│   └── AccountType.ts         # Account-related types
│
├── WatchList/
│   ├── WatchlistService.ts    # Watchlist service methods
│   └── WatchlistType.ts       # Watchlist-related types
│
└── [ServiceName]/
    ├── [ServiceName]Service.ts
    └── [ServiceName]Type.ts
```

### Quy Tắc Đặt Tên

- **Folder**: PascalCase - `Auth`, `Account`, `WatchList`
- **Service file**: `[ServiceName]Service.ts`
- **Type file**: `[ServiceName]Type.ts`
- **Service object/class**: `[ServiceName]Service`

---

## API Class và Instances

### Singleton Instances

```typescript
// app/services/api/index.ts

// Instance chính - timeout 30s
export const api = new Api()
```

### Khi Nào Sử Dụng Instance Nào?

- **`api`**: Dùng cho tất cả các API calls thông thường

### API Methods

API class cung cấp 4 methods chính:

```typescript
// GET request
api.get<T>(path: string, params?: Record<string, any>, config?: Record<string, any>): Promise<T>

// POST request
api.post<T>(path: string, data?: any, config?: Record<string, any>): Promise<T>

// PUT request
api.put<T>(path: string, data?: any, config?: Record<string, any>): Promise<T>

// DELETE request
api.delete<T>(path: string, params?: Record<string, any>, data?: any, config?: Record<string, any>): Promise<T>
```

---

## Tạo Service Mới

### Bước 1: Tạo Cấu Trúc Thư Mục

```bash
app/services/api/
└── YourService/
    ├── YourServiceService.ts
    └── YourServiceType.ts
```

### Bước 2: Định Nghĩa Types

**YourServiceType.ts**

```typescript
import { ApiEnvelope } from "../types"

// Request types
export interface CreateItemRequest {
  name: string
  description?: string
}

export interface UpdateItemRequest {
  id: number
  name?: string
  description?: string
}

export interface GetItemsParams {
  page?: number
  pageSize?: number
  search?: string
}

// Response types
export interface ItemDto {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ItemsPagedResponse {
  items: ItemDto[]
  total: number
  page: number
  pageSize: number
}

// Export with ApiEnvelope wrapper if needed
export type CreateItemResponse = ApiEnvelope<ItemDto>
export type GetItemsResponse = ApiEnvelope<ItemsPagedResponse>
```

### Bước 3: Tạo Service (Pattern 1 - Object Export) ✅ Recommended

**YourServiceService.ts**

```typescript
import { api } from "../index"
import type {
  CreateItemRequest,
  UpdateItemRequest,
  GetItemsParams,
  CreateItemResponse,
  GetItemsResponse,
  ItemDto,
} from "./YourServiceType"
import { ApiEnvelope } from "../types"

// Define API paths as constants
const YourServicePath = {
  ITEMS: "/api/v1/items",
  ITEM_DETAIL: (id: number) => `/api/v1/items/${id}`,
  ITEM_SEARCH: "/api/v1/items/search",
} as const

// Export service object with methods
export const YourService = {
  /**
   * Get paginated items
   */
  getItems: (params: GetItemsParams) => api.get<GetItemsResponse>(YourServicePath.ITEMS, params),

  /**
   * Get item by ID
   */
  getItemById: (id: number) => api.get<ApiEnvelope<ItemDto>>(YourServicePath.ITEM_DETAIL(id)),

  /**
   * Create new item
   */
  createItem: (payload: CreateItemRequest) =>
    api.post<CreateItemResponse>(YourServicePath.ITEMS, payload),

  /**
   * Update existing item
   */
  updateItem: (id: number, payload: UpdateItemRequest) =>
    api.put<ApiEnvelope<ItemDto>>(YourServicePath.ITEM_DETAIL(id), payload),

  /**
   * Delete item
   */
  deleteItem: (id: number) => api.delete<ApiEnvelope<void>>(YourServicePath.ITEM_DETAIL(id)),

  /**
   * Search items
   */
  searchItems: (query: string) =>
    api.get<GetItemsResponse>(YourServicePath.ITEM_SEARCH, { q: query }),
}

// Export type for better TypeScript support
export type YourServiceType = typeof YourService
```

### Bước 3: Tạo Service (Pattern 2 - Class Export)

**YourServiceService.ts**

```typescript
import { api } from "../index"
import type { CreateItemRequest, CreateItemResponse, GetItemsResponse } from "./YourServiceType"

export class YourService {
  /**
   * Get paginated items
   */
  getItems = async (params: GetItemsParams): Promise<GetItemsResponse> => {
    try {
      const response = await api.get<GetItemsResponse>("/api/v1/items", params)
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Create new item
   */
  createItem = async (data: CreateItemRequest): Promise<CreateItemResponse> => {
    try {
      const response = await api.post<CreateItemResponse>("/api/v1/items", data)
      return response
    } catch (error) {
      throw error
    }
  }
}
```

**⚠️ Lưu ý**: Pattern 1 (Object Export) được khuyến nghị vì:

- Đơn giản hơn
- Không cần dùng `new` keyword khi import
- Tree-shaking tốt hơn
- Phù hợp với functional programming style

### Bước 4: Export trong index.ts

**app/services/api/index.ts**

```typescript
export { YourService } from "./YourService/YourServiceService"
```

---

## Error Handling

### API Methods Throw Errors

```typescript
// ❌ SAI - Code cũ, không còn dùng
const result = await api.get("/users")
if (!result.ok) {
  // Handle error
}

// ✅ ĐÚNG - Code mới
try {
  const data = await api.get<ApiEnvelope<User>>("/users")
  // Handle success
  console.log(data.data)
} catch (error) {
  // Handle error - error có type GeneralApiProblem
  const apiError = error as GeneralApiProblem
  switch (apiError.kind) {
    case "unauthorized":
      // Handle 401
      break
    case "forbidden":
      // Handle 403
      break
    case "not-found":
      // Handle 404
      break
    case "timeout":
      // Handle timeout
      break
    case "cannot-connect":
      // Handle connection error
      break
    case "server":
      // Handle 5xx errors
      break
    default:
      // Handle unknown errors
      break
  }
}
```

### GeneralApiProblem Types

```typescript
type GeneralApiProblem =
  | { kind: "timeout"; temporary: true; message?: string; path?: string }
  | { kind: "cannot-connect"; temporary: true; message?: string; path?: string }
  | { kind: "server"; message?: string; path?: string }
  | { kind: "unauthorized"; message?: string; path?: string; isLogout?: boolean }
  | { kind: "forbidden"; message?: string; path?: string }
  | { kind: "not-found"; message?: string; path?: string }
  | { kind: "rejected"; message?: string; path?: string }
  | { kind: "unknown"; temporary: true; message?: string; path?: string }
  | { kind: "bad-data"; message?: string; path?: string }
```

### Error Handling Best Practices

```typescript
// ✅ Xử lý error cụ thể trong service
export const WatchlistService = {
  getWatchlist: async (params: GetWatchlistParams) => {
    try {
      return await api.get<ApiEnvelope<PagedResponse<WatchlistItem>>>("/api/v1/watchlist", params)
    } catch (error) {
      const apiError = error as GeneralApiProblem

      // Log error cho debugging
      console.error("Watchlist API Error:", {
        kind: apiError.kind,
        message: apiError.message,
        path: apiError.path,
      })

      // Re-throw để component xử lý
      throw error
    }
  },
}

// ✅ Xử lý error trong component với TanStack Query
const { data, error, isLoading } = useQuery({
  queryKey: ["watchlist", params],
  queryFn: () => WatchlistService.getWatchlist(params),
  retry: (failureCount, error) => {
    const apiError = error as GeneralApiProblem
    // Retry cho temporary errors
    if (apiError.temporary && failureCount < 3) {
      return true
    }
    // Không retry cho 401, 403, 404
    if (["unauthorized", "forbidden", "not-found"].includes(apiError.kind)) {
      return false
    }
    return false
  },
})

// Handle error trong UI
if (error) {
  const apiError = error as GeneralApiProblem
  if (apiError.kind === "unauthorized") {
    // Navigate to login
  }
}
```

---

## ApiEnvelope Pattern

### Định Nghĩa

```typescript
export interface ApiEnvelope<T = unknown> {
  result?: number
  errors?: Record<string, unknown>
  message?: string
  data?: T
}
```

### Sử Dụng ApiEnvelope

```typescript
// ✅ Service method với ApiEnvelope
export const UserService = {
  getUser: (id: string) => api.get<ApiEnvelope<User>>(`/api/v1/users/${id}`),

  getUsers: (params: GetUsersParams) =>
    api.get<ApiEnvelope<PagedResponse<User>>>("/api/v1/users", params),
}

// ✅ Sử dụng trong component
const fetchUser = async (id: string) => {
  try {
    const response = await UserService.getUser(id)

    // Check result code if needed
    if (response.result !== 0) {
      console.error("API returned error:", response.message)
      return
    }

    // Access data
    const user = response.data
    console.log(user)
  } catch (error) {
    // Handle error
  }
}
```

---

## Request Transforms

API class tự động thêm các transforms cho mọi request:

### Authorization Header

```typescript
// Tự động thêm từ storage
request.headers = {
  ...request.headers,
  Authorization: `Bearer ${token}`,
}
```

### App Metadata

```typescript
// POST, PUT, PATCH - trong body
request.data = {
  ...data,
  appVersion: "1.0.0",
  platform: "ios" | "android",
}

// GET, DELETE - trong query params
request.params = {
  ...params,
  appVersion: "1.0.0",
  platform: "ios" | "android",
}
```

### FormData Support

```typescript
// ✅ Upload file với FormData
const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append("avatar", file)
  // appVersion và platform tự động được thêm vào

  return api.post<ApiEnvelope<{ url: string }>>("/api/v1/account/upload-avatar", formData)
}
```

---

## Service Paths Constants

### Tại Sao Sử Dụng Constants?

```typescript
// ❌ SAI - Hard-code paths
export const AuthService = {
  login: (payload: LoginRequest) =>
    api.post<ApiEnvelope<LoginResponse>>("/api/v1/auth/login", payload),

  logout: () => api.post<ApiEnvelope>("/api/v1/auth/logout"),
}

// ✅ ĐÚNG - Sử dụng constants
const AuthServicePath = {
  LOGIN: "/api/v1/auth/login",
  LOGOUT: "/api/v1/auth/logout",
  REGISTER: "/api/v1/auth/register",
  // Dynamic paths
  CHECK_VALID: (hash: string) => `/api/v1/auth/check-valid/${hash}`,
} as const

export const AuthService = {
  login: (payload: LoginRequest) =>
    api.post<ApiEnvelope<LoginResponse>>(AuthServicePath.LOGIN, payload),

  logout: () => api.post<ApiEnvelope>(AuthServicePath.LOGOUT),

  checkValid: (hash: string) => api.get<ApiEnvelope>(AuthServicePath.CHECK_VALID(hash)),
}
```

**Lợi ích:**

- Dễ maintain và refactor
- Tránh typos
- Type-safe với `as const`
- Có thể reuse paths
- Documentation tốt hơn

---

## TypeScript Best Practices

### 1. Generic Types

```typescript
// ✅ Sử dụng generics cho reusable types
interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// Sử dụng
type UsersPagedResponse = PagedResponse<User>
type ProductsPagedResponse = PagedResponse<Product>
```

### 2. Type Inference

```typescript
// ✅ Let TypeScript infer return type
export const WatchlistService = {
  getItems: (params: GetItemsParams) =>
    api.get<ApiEnvelope<PagedResponse<Item>>>("/api/v1/items", params),
}

// Type được infer tự động
const result = await WatchlistService.getItems({ page: 1 })
// result: ApiEnvelope<PagedResponse<Item>>
```

### 3. Strict Typing

```typescript
// ✅ Không dùng `any`
interface CreateUserRequest {
  name: string
  email: string
  age?: number
}

// ❌ SAI
const createUser = (data: any) => api.post("/users", data)

// ✅ ĐÚNG
const createUser = (data: CreateUserRequest) => api.post<ApiEnvelope<User>>("/users", data)
```

### 4. Export Types

```typescript
// ✅ Export service type
export const YourService = {
  getItems: () => api.get<Items>("/items"),
}

export type YourServiceType = typeof YourService

// Sử dụng trong tests hoặc mocking
const mockService: YourServiceType = {
  getItems: jest.fn(),
}
```

---

## Testing API Services

### Mock API Instance

```typescript
// __tests__/YourService.test.ts
import { api } from "@/services/api"
import { YourService } from "@/services/api/YourService/YourServiceService"

// Mock api module
jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe("YourService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should fetch items successfully", async () => {
    const mockData = {
      data: {
        items: [{ id: 1, name: "Item 1" }],
        total: 1,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockData)

    const result = await YourService.getItems({ page: 1 })

    expect(api.get).toHaveBeenCalledWith("/api/v1/items", { page: 1 })
    expect(result).toEqual(mockData)
  })

  it("should handle errors", async () => {
    const mockError = {
      kind: "not-found",
      message: "Item not found",
    }

    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(YourService.getItemById(999)).rejects.toEqual(mockError)
  })
})
```

### Integration Testing

```typescript
// __tests__/integration/api.integration.test.ts
import { api } from "@/services/api"

describe("API Integration", () => {
  // Test với real API (nếu có test environment)
  it("should connect to API", async () => {
    try {
      const response = await api.get<{ status: string }>("/health")
      expect(response.status).toBe("ok")
    } catch (error) {
      // API chưa sẵn sàng
      console.warn("API not available for integration test")
    }
  })
})
```

---

## Performance Best Practices

### 1. Request Cancellation

```typescript
// ✅ Cancel requests khi component unmount
export const useSearchItems = () => {
  const abortControllerRef = useRef<AbortController>()

  const searchItems = async (query: string) => {
    // Cancel previous request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    try {
      return await api.get(
        "/items/search",
        { q: query },
        { signal: abortControllerRef.current.signal },
      )
    } catch (error) {
      if ((error as any).name === "AbortError") {
        // Request was cancelled
        return null
      }
      throw error
    }
  }

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return { searchItems }
}
```

### 2. Request Debouncing

```typescript
// ✅ Debounce search requests
import { useMemo } from "react"
import { debounce } from "lodash"

export const useSearchWithDebounce = () => {
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        return await YourService.searchItems(query)
      }, 300),
    [],
  )

  return { search: debouncedSearch }
}
```

### 3. Caching với TanStack Query

```typescript
// ✅ Cache API responses
export const useItems = (params: GetItemsParams) => {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => YourService.getItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

---

## Security Best Practices

### 1. Token Management

```typescript
// ✅ Sử dụng MMKV storage (encrypted)
import { storage } from "@/utils/storage"

export const AUTH_TOKEN_KEY = "auth_token"

export const setAuthToken = (token: string) => {
  storage.set(AUTH_TOKEN_KEY, token)
  api.setAuthToken(token)
}

export const clearAuthToken = () => {
  storage.delete(AUTH_TOKEN_KEY)
  api.setAuthToken(undefined)
}
```

### 2. Input Validation

```typescript
// ✅ Validate input trước khi gọi API
export const createUser = async (data: CreateUserRequest) => {
  // Validate
  if (!data.email || !data.email.includes("@")) {
    throw new Error("Invalid email")
  }

  if (!data.password || data.password.length < 8) {
    throw new Error("Password must be at least 8 characters")
  }

  // Call API
  return await api.post<ApiEnvelope<User>>("/api/v1/users", data)
}
```

### 3. Sensitive Data

```typescript
// ❌ SAI - Log sensitive data
console.log("Login request:", { email, password })

// ✅ ĐÚNG - Không log sensitive data
console.log("Login request for:", email)

// ✅ ĐÚNG - Mask sensitive data in logs
const maskPassword = (data: LoginRequest) => ({
  ...data,
  password: "***",
})
console.log("Login request:", maskPassword(loginData))
```

---

## Common Patterns

### 1. Pagination

```typescript
interface PaginationParams {
  page?: number
  pageSize?: number
}

interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const getItems = (params: PaginationParams) =>
  api.get<ApiEnvelope<PagedResponse<Item>>>("/api/v1/items", {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  })
```

### 2. Search

```typescript
interface SearchParams {
  query: string
  filters?: Record<string, any>
  page?: number
  pageSize?: number
}

export const searchItems = (params: SearchParams) =>
  api.get<ApiEnvelope<PagedResponse<Item>>>("/api/v1/items/search", params)
```

### 3. Batch Operations

```typescript
export const batchDeleteItems = (ids: number[]) =>
  api.post<ApiEnvelope<{ deletedCount: number }>>("/api/v1/items/batch-delete", { ids })
```

### 4. File Upload

```typescript
export const uploadFile = async (file: { uri: string; type: string; name: string }) => {
  const formData = new FormData()
  formData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any)

  return api.post<ApiEnvelope<{ url: string }>>("/api/v1/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
```

---

## Documentation Standards

### Service Documentation

````typescript
/**
 * WatchlistService - Manages user watchlists
 *
 * @example
 * ```typescript
 * // Get watchlist
 * const response = await WatchlistService.getWatchlist({ page: 1 })
 * const items = response.data?.items ?? []
 *
 * // Add to watchlist
 * await WatchlistService.add({ symbol: 'AAPL', type: 'stock' })
 * ```
 */
export const WatchlistService = {
  /**
   * Get paginated watchlist items
   * @param params - Pagination and filter parameters
   * @returns Promise with paginated watchlist items
   * @throws {GeneralApiProblem} When API call fails
   */
  getWatchlist: (params: GetWatchlistParams) =>
    api.get<ApiEnvelope<PagedResponse<WatchlistItem>>>(WatchlistServicePath.WATCHLIST, params),
}
````

### Type Documentation

```typescript
/**
 * Request payload for creating a new item
 */
export interface CreateItemRequest {
  /** Item name (required, 2-100 characters) */
  name: string

  /** Optional description (max 500 characters) */
  description?: string

  /** Item category ID */
  categoryId: number

  /** Item tags */
  tags?: string[]
}
```

---

## Checklist Khi Tạo Service Mới

- [ ] Tạo folder `ServiceName/` trong `app/services/api/`
- [ ] Tạo file `ServiceNameType.ts` với đầy đủ types
- [ ] Tạo file `ServiceNameService.ts` với service methods
- [ ] Định nghĩa `ServiceNamePath` constants
- [ ] Sử dụng `ApiEnvelope<T>` cho responses
- [ ] Export service trong `app/services/api/index.ts`
- [ ] Thêm JSDoc comments cho service và methods
- [ ] Sử dụng proper TypeScript types (không dùng `any`)
- [ ] Handle errors với try-catch
- [ ] Viết unit tests cho service
- [ ] Test với TanStack Query integration
- [ ] Update documentation nếu cần

---

## Migration Guide - Từ Code Cũ

### Từ Return Error Objects → Throw Errors

```typescript
// ❌ Code cũ
const result = await api.get("/users")
if (!result.ok) {
  const problem = getGeneralApiProblem(result)
  // Handle error
  return
}
const users = result.data

// ✅ Code mới
try {
  const response = await api.get<ApiEnvelope<User[]>>("/users")
  const users = response.data
} catch (error) {
  const apiError = error as GeneralApiProblem
  // Handle error
}
```

### Migration Steps

1. Thêm try-catch xung quanh API calls
2. Update type definitions (sử dụng generic `<T>`)
3. Remove error checking với `.ok` property
4. Cast error to `GeneralApiProblem` type
5. Test thoroughly

---

## Tài Liệu Tham Khảo

- [API Error Handling](./apiProblem.ts)
- [TanStack Query Integration](../docs/tanstack-plan.md)
- [Coding Standards](./coding-standards.md)
- [TypeScript Best Practices](./coding-standards.md)

---

## FAQs

### Q: Có cần wrap service methods trong try-catch không?

**A:** Không bắt buộc trong service methods. Nên handle errors ở component level hoặc trong TanStack Query để có UI feedback tốt hơn.

### Q: Làm sao để retry failed requests?

**A:** Sử dụng TanStack Query's `retry` option:

```typescript
useQuery({
  queryKey: ["data"],
  queryFn: () => YourService.getData(),
  retry: 3,
})
```

### Q: Có nên validate input trong service không?

**A:** Có, validate basic constraints (required fields, format) trong service. Validate business logic ở backend.

### Q: Pattern nào tốt hơn: Object Export hay Class Export?

**A:** **Object Export** được khuyến nghị vì đơn giản hơn và phù hợp với functional style của React.

---

## Liên Hệ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ team lead hoặc tạo issue trong repository.
