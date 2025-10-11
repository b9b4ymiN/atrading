import { apiFetch } from "@/lib/api-client";
import { endpoints } from "@/lib/api-client/endpoints";
import { Card, CardGrid } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/Stats";

export default async function HealthPage() {
  let health: any = null;
  let status: any = null;
  let healthError: string | null = null;
  let statusError: string | null = null;

  try {
    health = await apiFetch(endpoints.health());
  } catch (err: any) {
    healthError = err.message;
  }

  try {
    status = await apiFetch(endpoints.status(), { cacheSeconds: 5, tag: "status" });
  } catch (err: any) {
    statusError = err.message;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">System Health</h1>
          <p className="text-sm sm:text-base text-slate-400">Monitor system status and API connectivity</p>
        </div>

        {/* Health Status Overview */}
        <CardGrid className="mb-4 sm:mb-6">
          <StatCard
            label="API Status"
            value={healthError ? "Offline" : health?.status || "Online"}
            changeType={healthError ? "negative" : "positive"}
            subtitle={healthError ? "Connection failed" : "API is responding"}
          />
          <StatCard
            label="System Status"
            value={statusError ? "Error" : status?.status || "Operational"}
            changeType={statusError ? "negative" : "positive"}
            subtitle={statusError ? "Unable to fetch" : "Connected"}
          />
          {health?.timestamp && (
            <StatCard
              label="Last Check"
              value={new Date(health.timestamp).toLocaleTimeString()}
              subtitle={new Date(health.timestamp).toLocaleDateString()}
            />
          )}
          {health?.uptime && (
            <StatCard
              label="Uptime"
              value={typeof health.uptime === 'number' ? 
                `${(health.uptime / 3600).toFixed(1)}h` : 
                health.uptime}
              subtitle="Server uptime"
            />
          )}
        </CardGrid>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card title="API Health Details" subtitle={healthError ? "Connection Error" : "Health check response"}>
            {healthError ? (
              <div className="space-y-3">
                <Badge variant="danger">Connection Failed</Badge>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 text-sm">{healthError}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The API endpoint is not responding. Please check your connection or try again later.
                </p>
              </div>
            ) : health ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Online</Badge>
                  {health.version && (
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      v{health.version}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {health.database !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Database</span>
                      <Badge variant={health.database === 'connected' || health.database === true ? 'success' : 'danger'}>
                        {typeof health.database === 'boolean' ? 
                          (health.database ? 'Connected' : 'Disconnected') : 
                          health.database}
                      </Badge>
                    </div>
                  )}
                  
                  {health.redis !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Redis</span>
                      <Badge variant={health.redis === 'connected' || health.redis === true ? 'success' : 'warning'}>
                        {typeof health.redis === 'boolean' ? 
                          (health.redis ? 'Connected' : 'Disconnected') : 
                          health.redis}
                      </Badge>
                    </div>
                  )}

                  {health.memory !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Memory Usage</span>
                      <span className="font-mono text-sm text-slate-900 dark:text-white">
                        {typeof health.memory === 'number' ? 
                          `${(health.memory / 1024 / 1024).toFixed(2)} MB` : 
                          health.memory}
                      </span>
                    </div>
                  )}

                  {Object.keys(health).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(health)
                          .filter(([key]) => !['status', 'timestamp', 'uptime', 'database', 'redis', 'memory', 'version'].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-slate-600 dark:text-slate-400">{key}:</span>{' '}
                              <span className="font-medium text-slate-900 dark:text-white">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No health data available</p>
              </div>
            )}
          </Card>

          <Card title="System Status Details" subtitle={statusError ? "Status Error" : "Live system metrics"}>
            {statusError ? (
              <div className="space-y-3">
                <Badge variant="danger">Error</Badge>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 text-sm">{statusError}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Unable to retrieve system status. Authentication may be required.
                </p>
              </div>
            ) : status ? (
              <div className="space-y-4">
                <Badge variant="success">Connected</Badge>
                
                <div className="space-y-3">
                  {status.serverTime !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Server Time</span>
                      <span className="font-mono text-sm text-slate-900 dark:text-white">
                        {new Date(status.serverTime).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {status.timezone !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</span>
                      <span className="font-mono text-sm text-slate-900 dark:text-white">
                        {status.timezone}
                      </span>
                    </div>
                  )}

                  {status.rateLimits && Array.isArray(status.rateLimits) && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rate Limits</p>
                      <div className="space-y-2">
                        {status.rateLimits.slice(0, 3).map((limit: any, idx: number) => (
                          <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
                            <span>{limit.rateLimitType || 'Type'}:</span>
                            <span className="font-mono">
                              {limit.limit || 'N/A'} / {limit.interval || 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(status).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        All Status Fields
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(status)
                          .filter(([key]) => !['serverTime', 'timezone', 'rateLimits'].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">{key}:</span>
                              <span className="font-mono text-slate-900 dark:text-white text-xs ml-2 text-right">
                                {typeof value === 'object' ? 
                                  JSON.stringify(value, null, 2).substring(0, 100) + '...' : 
                                  String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No status data available</p>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-4 sm:mt-6">
          <a
            href="/login"
            className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl min-h-[48px] touch-manipulation text-base w-full sm:w-auto"
          >
            Go to Login
          </a>
        </div>
      </div>
    </main>
  );
}
