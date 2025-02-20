TWO_PLAYERS = 2
MULTI_PLAYERS = 4
GAME_START_DELAY = 2
GAME_TICK_RATE =  0.02
WINNING_SCORE = 10
AUTHORIZATION_STATUS_CODE=4000
GAME_ERROR_STATUS_CODE=3000
SUCCES_STATUS_CODE  = 200
from dataclasses import dataclass


@dataclass
class Vector3:
    x: float
    y: float
    z: float