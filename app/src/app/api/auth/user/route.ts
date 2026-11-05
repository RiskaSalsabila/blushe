import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const user = await getCurrentUser();
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    );
  }
}
