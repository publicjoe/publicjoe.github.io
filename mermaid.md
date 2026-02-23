# Mucking About with mermaid

```mermaid
sequenceDiagram
autonumber

participant B as Browser
participant I as Service
participant S as Secure Service

B->>+I: Change Something
I-->>-B: 403: Nope
B->>+S: 302 Redirect to
S-->>-B: User completion
```
