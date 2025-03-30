import { Middleware } from "express-zod-api";
import { Metrics, MetricUnit } from "@aws-lambda-powertools/metrics";

export class MetricsCollector {
  private metrics: Metrics;

  constructor() {
    this.metrics = new Metrics({
      namespace: "EVEDatacore",
      serviceName: "analytics",
      defaultDimensions: {
        environment: process.env.ENV ?? "unknown",
      },
    });
  }

  analyticEvent(eventKey: string, count: number = 1) {
    this.metrics.addMetric(eventKey, MetricUnit.Count, count);
    const [type] = eventKey.split(":", 2);
    this.metrics.addMetric(`total:${type}`, MetricUnit.Count, count);
    this.metrics.addMetric("total", MetricUnit.Count, count);
  }

  analyticsNewVisitor(count: number = 1) {
    this.metrics.addMetric("visitors", MetricUnit.Count, count);
  }

  flush() {
    if (this.metrics.hasStoredMetrics()) {
      this.metrics.publishStoredMetrics();
    }
  }
}

const metricsService = new MetricsCollector();

export const middlewareMetrics = new Middleware({
  handler: async () => {
    return { metrics: metricsService };
  },
});
