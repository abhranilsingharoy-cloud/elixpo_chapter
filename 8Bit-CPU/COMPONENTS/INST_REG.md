```mermaid
graph TD
    CLK[Clock Signal] --> IR[Instruction Register]
    Data[Data Bus] --> IR
    IR --> Decode[Instruction Decoder]
    Decode --> ControlBus[Control Signals]

```
