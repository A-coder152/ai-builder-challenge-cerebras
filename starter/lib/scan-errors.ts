import { NextResponse } from "next/server";

export type ScanError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export function scanErrorResponse(error: any) {
  const status = error.status || 422;
  const body: { error: ScanError } = {
    error: {
      code: error.code || "invalid_request",
      message: error.message || "An error occurred during the scan.",
      details: error.details,
    },
  };
  return NextResponse.json(body, { status });
}

export function validateAssetTag(tag: unknown): string {
  if (typeof tag !== "string" || !/^C\d{7}$/.test(tag)) {
    throw {
      status: 422,
      code: "invalid_tag_format",
      message: "Asset tags must follow the format C0000000.",
    };
  }
  return tag;
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw {
      status: 422,
      code: "invalid_payload",
      message: `${field} is required.`,
      details: { field },
    };
  }
  return value.trim();
}
