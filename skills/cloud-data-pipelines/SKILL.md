---
name: cloud-data-pipelines
description: High-throughput cloud data engineering, BigQuery SQL optimization, GCP Dataflow, automated data quality, and dbt models. Triggers on 'data pipeline', 'BigQuery pipeline', 'ETL job', or 'data throughput'.
---

# Cloud Data Pipelines Protocol (SuperSkill)

This SuperSkill orchestrates large-scale data ingestion, BigQuery cost/scan optimization, automated data cleaning, and Apache Beam / GCP Dataflow pipelines.

## Execution Phases & Progressive Disclosure

### Phase 1: BigQuery Query & Partitioning Optimization
> *Load reference module for BigQuery SQL*:
> Read [`references/bigquery-optimization.md`](references/bigquery-optimization.md)
- Partition tables on event timestamp (`PARTITION BY DATE(event_timestamp)`).
- Cluster tables on frequently filtered IDs (`CLUSTER BY user_id, organization_id`).
- Avoid `SELECT *`; project strictly necessary columns to minimize scan billing.

### Phase 2: Data Quality & Auto-Cleaning
> *Load reference module for automated data cleaning*:
> Read [`references/data-quality.md`](references/data-quality.md)
- Implement deduplication, null coalescing, and type coercion.
- Define schema validation contracts before loading warehouse tables.

### Phase 3: High-Throughput Streaming & Batch ETL
> *Load reference module for Dataflow & Apache Beam*:
> Read [`references/dataflow-beam.md`](references/dataflow-beam.md)
- Windowing strategies (Fixed, Sliding, Session) for streaming pipelines.
- Handle dead-letter queues (DLQ) for malformed records.

## Output Format
Deliver optimized SQL queries, dbt models, or Beam pipeline code with estimated BigQuery byte-scan savings.
