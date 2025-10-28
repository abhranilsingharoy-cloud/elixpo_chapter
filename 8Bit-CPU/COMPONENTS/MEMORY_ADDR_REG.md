graph TD
    Input[Address Input] --> Latch[Address Latch]
    Latch --> MUX[Multiplexer]
    
    AltSource[Another Address Source] --> MUX[Multiplexer]
    Select[Select Signal] --> MUX

    MUX --> Output[Address Bus]
