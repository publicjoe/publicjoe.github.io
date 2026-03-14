# Weather API Service -- Extended System Design Overview

This document describes a scalable backend architecture for a weather
service. It is written in a way that can be used to explain the system
in a **system design interview**.

The system provides weather data to a UI while reducing latency and cost
through caching.

------------------------------------------------------------------------

# High-Level Architecture

``` mermaid
flowchart LR

    UI[User Interface]

    CDN[CDN]

    APIGW[API Gateway]

    ALB[Application Load Balancer]

    subgraph AWS
        ECS[ECS Fargate<br/>Node.js Express API]
        REDIS[(Redis Cache)]
    end

    WEATHER[3rd Party Weather API]

    UI --> CDN
    CDN --> APIGW
    APIGW --> ALB
    ALB --> ECS

    ECS --> REDIS
    ECS --> WEATHER
```

------------------------------------------------------------------------

# Basic Architecture (Core Components)

``` mermaid
flowchart LR
    UI[User Interface] --> API[Node.js Express API<br/>ECS Fargate]

    API --> CACHE[Redis Cache]
    API --> WEATHER[3rd Party Weather API]

    CACHE -. Cache Read/Write .-> API
    WEATHER -. HTTP Requests .-> API
```

------------------------------------------------------------------------

# Request Flow

``` mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Redis
    participant WeatherAPI

    User->>UI: Request weather
    UI->>API: GET /weather?location=X

    API->>Redis: Check cache

    alt Cache Hit
        Redis-->>API: Cached response
        API-->>UI: Return cached response
    else Cache Miss
        API->>WeatherAPI: Request weather data
        WeatherAPI-->>API: Weather response
        API->>Redis: Cache response (TTL)
        API-->>UI: Return weather data
    end
```

------------------------------------------------------------------------

# Components

## User Interface

Examples:

-   Web app
-   Mobile app
-   Dashboard

Responsibilities:

-   Collect user location
-   Request weather data
-   Display results

Design Benefits:

-   Decoupled frontend and backend
-   Multiple clients can use the same API

------------------------------------------------------------------------

# CDN

A CDN can cache static assets and sometimes API responses close to
users.

Benefits:

-   Reduced latency
-   Lower load on backend
-   Better global performance

Examples:

-   CloudFront
-   Cloudflare

------------------------------------------------------------------------

# API Gateway

API Gateway sits in front of the service.

Responsibilities:

-   Authentication
-   Rate limiting
-   Request validation
-   API versioning

Benefits:

-   Protects backend services
-   Centralised API management

------------------------------------------------------------------------

# Application Load Balancer

The ALB distributes traffic across ECS tasks.

Benefits:

-   High availability
-   Health checks
-   Load distribution

Traffic is spread across multiple containers running in different
availability zones.

------------------------------------------------------------------------

# API Layer (Node.js + Express)

The API service handles:

-   Request validation
-   Cache lookup
-   Third-party API calls
-   Response formatting

Node.js is a good fit because:

-   Weather services are I/O heavy
-   Node handles concurrent requests efficiently
-   Fast development cycle

------------------------------------------------------------------------

# ECS Fargate

The service runs as containers on ECS Fargate.

Benefits:

-   No server management
-   Auto scaling
-   Easy container deployment

Scaling can be triggered by:

-   CPU usage
-   Memory usage
-   Request rate

------------------------------------------------------------------------

# Redis Cache

Redis provides a high-speed cache.

Typical cache structure:

Key:

location:London

Value:

JSON weather response

TTL:

5--15 minutes

Benefits:

-   Lower latency
-   Reduced cost from external APIs
-   Improved resilience

------------------------------------------------------------------------

# Third Party Weather API

Examples include:

-   OpenWeather
-   WeatherAPI
-   AccuWeather

External APIs introduce risks:

-   Rate limits
-   Latency
-   Availability
-   Cost per request

------------------------------------------------------------------------

# Caching Strategy

Common strategies:

## TTL Cache

Cache responses for a fixed period.

Example:

10 minutes

## Stale While Revalidate

Return cached data immediately while refreshing cache asynchronously.

## Cache Key Strategy

Keys could include:

location location + units location + language

------------------------------------------------------------------------

# Rate Limiting Design

Rate limiting protects:

-   External API quota
-   Backend resources

Rate limiting can occur at:

API Gateway

Example limits:

100 requests per minute per user

Redis can also store counters for distributed rate limits.

------------------------------------------------------------------------

# Handling 1 Million Requests per Day

Example scale:

1M requests per day ≈ 11.6 requests per second.

With caching:

Cache hit rate: 90%

External API calls:

100k/day

Scaling strategy:

-   2--4 ECS tasks
-   Redis cluster
-   Auto scaling enabled

------------------------------------------------------------------------

# Failure Scenarios

## Weather API Down

Possible responses:

-   Return cached data
-   Return partial data
-   Retry with exponential backoff
-   Use circuit breaker pattern

## Redis Failure

Fallback:

-   Direct API requests
-   Reduced performance

Production mitigation:

-   Redis cluster
-   Multi-AZ deployment

------------------------------------------------------------------------

# Observability

A production system must include observability.

## Logging

Structured logs:

-   Request ID
-   Location queries
-   Errors

## Metrics

Important metrics:

-   Cache hit rate
-   API latency
-   Error rates
-   External API usage

## Monitoring Tools

Examples:

-   CloudWatch
-   Datadog
-   Prometheus
-   Grafana

------------------------------------------------------------------------

# Security

Important areas:

HTTPS

API authentication

Secrets management

Weather API keys should be stored in:

AWS Secrets Manager

or

AWS Parameter Store

------------------------------------------------------------------------

# Multi-Region Disaster Recovery

For higher reliability the system can run in multiple regions.

``` mermaid
flowchart LR

    USER[Users]

    DNS[Geo DNS]

    subgraph Region A
        APIA[ECS Fargate API]
        REDISA[(Redis)]
    end

    subgraph Region B
        APIB[ECS Fargate API]
        REDISB[(Redis)]
    end

    WEATHER[Weather API]

    USER --> DNS
    DNS --> APIA
    DNS --> APIB

    APIA --> REDISA
    APIB --> REDISB

    APIA --> WEATHER
    APIB --> WEATHER
```

Benefits:

-   Disaster recovery
-   Reduced latency globally
-   Regional failover

------------------------------------------------------------------------

# Cost Considerations

Key cost drivers:

-   ECS compute
-   Redis cluster
-   External API usage
-   Data transfer

Cost optimisation strategies:

-   Increase cache hit rate
-   Reduce response payload sizes
-   Batch external API calls if possible

------------------------------------------------------------------------

# Tradeoffs

  Design Choice          Benefit                Tradeoff
  ---------------------- ---------------------- -------------------------------
  Node + Express         Fast development       Single threaded runtime
  Redis Cache            Low latency            Cache invalidation complexity
  Fargate                No server management   Higher compute cost
  External Weather API   No modelling needed    Dependency risk

------------------------------------------------------------------------

# Interview Talking Points

Topics often discussed in system design interviews:

Scaling strategy

Failure handling

Cache design

Rate limiting

Cost optimisation

Security

Global availability

------------------------------------------------------------------------

# Summary

This architecture demonstrates:

-   Decoupled frontend and backend
-   API orchestration layer
-   Efficient caching strategy
-   Horizontal scalability
-   Observability and resilience

The system can evolve further with:

-   Event-driven pipelines
-   Streaming weather updates
-   ML-based forecasting services
-   Advanced cache warming
