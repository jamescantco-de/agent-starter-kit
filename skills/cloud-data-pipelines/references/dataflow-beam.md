# Apache Beam / GCP Dataflow Patterns

1. **Windowing**: Align streaming windows with business reporting intervals.
2. **Dead Letter Queue (DLQ)**: Never drop failed records silently; route unparseable messages to a dead-letter BigQuery table or Pub/Sub topic for inspection.
