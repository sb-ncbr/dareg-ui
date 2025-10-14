import { NextResponse } from 'next/server';

export async function GET() {
  // Get all environment variables
  const envVars = process.env;
  
  // Filter auth-related variables
  const authVars = Object.keys(envVars)
    .filter(key => key.startsWith('AUTH_') || key.startsWith('NEXT_PUBLIC_'))
    .reduce((acc, key) => {
      const value = envVars[key];
      if (key.includes('SECRET') || key.includes('KEY')) {
        acc[key] = value ? "SET (hidden)" : "MISSING";
      } else {
        acc[key] = value || "MISSING";
      }
      return acc;
    }, {} as Record<string, string>);

  return NextResponse.json({
    message: "Environment variables debug",
    authVars,
    totalEnvVars: Object.keys(envVars).length,
    timestamp: new Date().toISOString()
  });
}
