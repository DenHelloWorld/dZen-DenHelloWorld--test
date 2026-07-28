import '@testing-library/jest-dom';

class PolyHeaders {
  private _headers = new Map<string, string>();

  constructor(init?: Record<string, string> | [string, string][]) {
    if (init) {
      const entries = Array.isArray(init) ? init : Object.entries(init);
      entries.forEach(([k, v]) => this._headers.set(k.toLowerCase(), v));
    }
  }

  get(key: string): string | null {
    return this._headers.get(key.toLowerCase()) ?? null;
  }

  set(key: string, value: string): void {
    this._headers.set(key.toLowerCase(), value);
  }

  has(key: string): boolean {
    return this._headers.has(key.toLowerCase());
  }

  delete(key: string): void {
    this._headers.delete(key.toLowerCase());
  }

  forEach(cb: (v: string, k: string) => void): void {
    this._headers.forEach((v, k) => cb(v, k));
  }

  entries(): MapIterator<[string, string]> {
    return this._headers.entries();
  }

  [Symbol.iterator](): MapIterator<[string, string]> {
    return this._headers[Symbol.iterator]();
  }
}

class PolyRequest {
  readonly url: string;
  readonly method: string;
  readonly headers: PolyHeaders;
  readonly body: unknown;
  readonly signal: AbortSignal;

  constructor(input: string | URL, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.toString();
    this.method = init?.method ?? 'GET';
    this.headers = new PolyHeaders(init?.headers as Record<string, string>);
    this.body = init?.body;
    this.signal = init?.signal ?? new AbortController().signal;
  }

  clone(): PolyRequest {
    return new PolyRequest(this.url, {
      method: this.method,
      headers: this.headers as unknown as Record<string, string>,
      body: this.body as BodyInit,
    });
  }
}

class PolyResponse {
  private _body: string;
  readonly status: number;
  readonly ok: boolean;
  readonly headers: PolyHeaders;
  private _consumed = false;

  constructor(body?: string | null, init?: { status?: number; headers?: Record<string, string> }) {
    this._body = body ?? '';
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new PolyHeaders(init?.headers);
  }

  async json(): Promise<unknown> {
    this._consumed = true;
    return JSON.parse(this._body);
  }

  async text(): Promise<string> {
    this._consumed = true;
    return this._body;
  }

  clone(): PolyResponse {
    if (this._consumed) return new PolyResponse(this._body, { status: this.status });
    this._consumed = true;
    return new PolyResponse(this._body, { status: this.status });
  }
}

type GlobalWithPolyfills = typeof globalThis & {
  Request: typeof PolyRequest;
  Response: typeof PolyResponse;
  Headers: typeof PolyHeaders;
  fetch: (req: unknown) => Promise<PolyResponse>;
};

if (typeof globalThis.Request === 'undefined') {
  const target = globalThis as GlobalWithPolyfills;
  target.Request = PolyRequest;
  target.Response = PolyResponse;
  target.Headers = PolyHeaders;

  target.fetch = async (req: unknown) => {
    const url = req instanceof PolyRequest ? req.url : String(req);
    // List endpoints return arrays; singular/mutation endpoints return objects
    const isList = /\/api\/(orders|products)$/.test(url);
    const body = isList ? '[]' : JSON.stringify({ success: true });
    return new PolyResponse(body, {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
}
