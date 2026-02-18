import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseClient';
import { startOfDay, startOfWeek, subDays } from 'date-fns';

/**
 * Admin Analytics API
 * GET: Returns visitor stats for the dashboard
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerClient();
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const sevenDaysAgo = subDays(now, 7);

    // Parallel fetches for performance
    const [
      { count: totalVisitors },
      { count: visitorsToday },
      { count: visitorsThisWeek },
      { data: visitsLast7Days },
      { data: topPages },
    ] = await Promise.all([
      supabase.from('visits').select('*', { count: 'exact', head: true }),
      supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', todayStart.toISOString()),
      supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', weekStart.toISOString()),
      supabase
        .from('visits')
        .select('visited_at')
        .gte('visited_at', sevenDaysAgo.toISOString())
        .order('visited_at', { ascending: true }),
      supabase
        .from('visits')
        .select('page_url')
        .order('visited_at', { ascending: false }),
    ]);

    // Aggregate visits by day for chart
    const visitsByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = subDays(now, i);
      const key = d.toISOString().slice(0, 10);
      visitsByDay[key] = 0;
    }
    (visitsLast7Days || []).forEach((v) => {
      const key = new Date(v.visited_at).toISOString().slice(0, 10);
      if (visitsByDay[key] !== undefined) {
        visitsByDay[key]++;
      }
    });

    // Top pages: count occurrences
    const pageCounts: Record<string, number> = {};
    (topPages || []).forEach((v) => {
      const url = v.page_url || '(unknown)';
      pageCounts[url] = (pageCounts[url] || 0) + 1;
    });
    const mostVisitedPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    const chartData = Object.entries(visitsByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, visitors: count }));

    return NextResponse.json({
      totalVisitors: totalVisitors ?? 0,
      visitorsToday: visitorsToday ?? 0,
      visitorsThisWeek: visitorsThisWeek ?? 0,
      chartData,
      mostVisitedPages,
    });
  } catch (err) {
    console.error('Analytics API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
