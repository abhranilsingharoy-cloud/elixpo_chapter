```mermaid
graph TD
    AInput[A Register] --> ALU
    BInput[B Register] --> ALU
    Flags[Zero/Carry/Negative/Even/Odd] --> ALU
    D_A_L_U --> Result[Output Bus]
    ALU --> FlagsOut[Flag Outputs]
```
