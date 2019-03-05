enum ApiMethod {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
  Put = "PUT",
  Delete = "DELETE"
}

export class ApiError extends Error {}

export interface ApiRequest<Body> {
  method: ApiMethod;
  endpoint: string;
  body: Body & any;
}

export interface ApiResponse<Reply> {
  status: number;
  headers: Headers;
  body: Reply;
}

export interface EnrollRequest {
  sessionId: string;
  facemap: Blob;
  auditTrailImage: string;
}

export interface EnrollResponse {}

export class ApiClient {
  private readonly baseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3001";

  async enroll(e: EnrollRequest): Promise<ApiResponse<EnrollResponse>> {
    const request: ApiRequest<EnrollRequest> = {
      method: ApiMethod.Post,
      endpoint: "/users",
      body: e
    };

    return this.request(request);
  }

  private async request<Body, Reply>(
    req: ApiRequest<Body>
  ): Promise<ApiResponse<Reply>> {
    const opts: RequestInit = {
      method: req.method
    };

    if (req.method !== ApiMethod.Get && req.body) {
      opts.body = req.body;
    }

    const response = await fetch(`${this.baseUrl}/${req.endpoint}`, opts);

    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status !== 204
    ) {
      throw new ApiError(`HTTP ${response.status}`);
    }

    const json = await response.json();

    const output: ApiResponse<Reply> = {
      status: response.status,
      headers: response.headers,
      body: json
    };

    return output;
  }
}