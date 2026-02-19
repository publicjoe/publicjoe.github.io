# Mucking About with mermaid


```mermaid
sequenceDiagram
autonumber

participant B as Browser
participant I as Id Service
participant S as Secure

B->>+I: Change Email Request
I-->>-B: 403: ACR too low
B->>+S: 302 Redirect to
S-->>-B: User completes 2FA
B->>-I: Redirect back
```


