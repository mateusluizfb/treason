var expect = require('expect.js');
var createMinimaxPlayer = require('../minimax-player');
var shared = require('../web/shared');
var stateNames = shared.states;

var fakeGame = {
    playerJoined: function () {}
};

var AI_IDX = 0;
var OPPONENT_1_IDX = 1;
var OPPONENT_2_IDX = 2;

describe('Minimax player', function () {
    var player, gameState;

    beforeEach(function () {
        player = createMinimaxPlayer(fakeGame);
        gameState = {
            livePlayers: [true, true],
            currentPlayer: AI_IDX,
            state: {
                players: [
                    {
                        cash: 0,
                        influence: [
                            {
                                role: 'ambassador',
                                revealed: false
                            },
                            {
                                role: 'ambassador',
                                revealed: false
                            }
                        ]
                    },
                    {
                        cash: 0,
                        influence: [
                            {
                                role: 'unknown',
                                revealed: false
                            },
                            {
                                role: 'unknown',
                                revealed: false
                            }
                        ]
                    }
                ],
                playerIdx: AI_IDX
            }
        };
        player._test.setAiPlayerIdx(AI_IDX);
    });

    describe('Possible moves', function () {
        describe('Given it is the start of a turn', function () {
            beforeEach(function () {
                gameState.state.state = {
                    name: stateNames.START_OF_TURN
                };
            });

            describe('Given the minimax player has one opponent and no cash', function () {
                it('should enumerate the zero-cost actions in priority order', function () {
                    var moves = player._test.getPossibleMoves(gameState)
                    expect(moves).to.eql([
                        {
                            command: 'action',
                            action: 'steal',
                            target: OPPONENT_1_IDX
                        },
                        {
                            command: 'action',
                            action: 'tax'
                        },
                        {
                            command: 'action',
                            action: 'exchange'
                        },
                        {
                            command: 'action',
                            action: 'income'
                        },
                        {
                            command: 'action',
                            action: 'foreign-aid'
                        }
                    ]);
                });
            });

            describe('Given the minimax player has two opponents', function () {
                beforeEach(function () {
                    gameState.state.players.push({
                        cash: 0,
                        influence: [
                            {
                                role: 'unknown',
                                revealed: false
                            },
                            {
                                role: 'unknown',
                                revealed: false
                            }
                        ]
                    });
                });

                describe('Given the minimax player has 3 cash', function () {
                    beforeEach(function () {
                        gameState.state.players[AI_IDX].cash = 3;
                    });

                    it('should include assassinate actions', function () {
                        var moves = player._test.getPossibleMoves(gameState)
                        expect(moves).to.eql([
                            {
                                command: 'action',
                                action: 'assassinate',
                                target: OPPONENT_1_IDX
                            },
                            {
                                command: 'action',
                                action: 'assassinate',
                                target: OPPONENT_2_IDX
                            },
                            {
                                command: 'action',
                                action: 'steal',
                                target: OPPONENT_1_IDX
                            },
                            {
                                command: 'action',
                                action: 'steal',
                                target: OPPONENT_2_IDX
                            },
                            {
                                command: 'action',
                                action: 'tax'
                            },
                            {
                                command: 'action',
                                action: 'exchange'
                            },
                            {
                                command: 'action',
                                action: 'income'
                            },
                            {
                                command: 'action',
                                action: 'foreign-aid'
                            }
                        ]);
                    });
                });

                describe('Given the minimax player has 7 cash', function () {
                    beforeEach(function () {
                        gameState.state.players[AI_IDX].cash = 7;
                    });

                    it('should include coup actions', function () {
                        var moves = player._test.getPossibleMoves(gameState)
                        expect(moves).to.eql([
                            {
                                command: 'action',
                                action: 'coup',
                                target: OPPONENT_1_IDX
                            },
                            {
                                command: 'action',
                                action: 'coup',
                                target: OPPONENT_2_IDX
                            },
                            {
                                command: 'action',
                                action: 'assassinate',
                                target: OPPONENT_1_IDX
                            },
                            {
                                command: 'action',
                                action: 'assassinate',
                                target: OPPONENT_2_IDX
                            },
                            {
                                command: 'action',
                                action: 'steal',
                                target: OPPONENT_1_IDX
                            },
                            {
                                command: 'action',
                                action: 'steal',
                                target: OPPONENT_2_IDX
                            },
                            {
                                command: 'action',
                                action: 'tax'
                            },
                            {
                                command: 'action',
                                action: 'exchange'
                            },
                            {
                                command: 'action',
                                action: 'income'
                            },
                            {
                                command: 'action',
                                action: 'foreign-aid'
                            }
                        ]);
                    });
                });

                describe('Given the minimax player has 10 cash', function () {
                    beforeEach(function () {
                        gameState.state.players[AI_IDX].cash = 10;
                    });

                    it('should only include coup actions', function () {
                        var moves = player._test.getPossibleMoves(gameState)
                        expect(moves).to.eql([
                            {
                                command: 'action',
                                action: 'coup',
                                target: OPPONENT_1_IDX
                            },
                            {
                                command: 'action',
                                action: 'coup',
                                target: OPPONENT_2_IDX
                            }
                        ]);
                    });
                });
            });
        });

        describe('Given we are responding to a player\'s action', function () {
            beforeEach(function () {
                gameState.state.state = {
                    name: stateNames.ACTION_RESPONSE
                };
                gameState.state.players.push({
                    cash: 0,
                    influence: [
                        {
                            role: 'unknown',
                            revealed: false
                        },
                        {
                            role: 'unknown',
                            revealed: false
                        }
                    ]
                });
            });

            describe('Given that an opponent is trying to assassinate the current player', function () {
                beforeEach(function () {
                    gameState.state.state.action = 'assassinate';
                    gameState.state.state.target = AI_IDX;
                    gameState.currentPlayer = AI_IDX;
                });

                it('should include a move to block the assassination, followed by one to allow and one to challenge', function () {
                    var moves = player._test.getPossibleMoves(gameState);
                    expect(moves).to.eql([
                        {
                            command: 'block',
                            blockingRole: 'contessa'
                        },
                        {
                            command: 'allow'
                        },
                        {
                            command: 'challenge'
                        }
                    ]);
                });
            });

            describe('Given that an opponent is trying to assassinate another opponent', function () {
                beforeEach(function () {
                    gameState.state.state.action = 'assassinate';
                    gameState.state.state.target = OPPONENT_2_IDX;
                    gameState.currentPlayer = AI_IDX;
                });

                it('should not include any blocking moves', function () {
                    var moves = player._test.getPossibleMoves(gameState);
                    expect(moves).to.eql([
                        {
                            command: 'allow'
                        },
                        {
                            command: 'challenge'
                        }
                    ]);
                });
            });

            describe('Given that the minimax player is trying to steal from the current player', function () {
                beforeEach(function () {
                    gameState.state.state.action = 'steal';
                    gameState.state.state.target = OPPONENT_1_IDX;
                    gameState.currentPlayer = OPPONENT_1_IDX;
                });

                it('should include the moves to block the steal', function () {
                    var moves = player._test.getPossibleMoves(gameState);
                    expect(moves).to.eql([
                        {
                            command: 'block',
                            blockingRole: 'captain'
                        },
                        {
                            command: 'block',
                            blockingRole: 'ambassador'
                        },
                        {
                            command: 'allow'
                        },
                        {
                            command: 'challenge'
                        }
                    ]);
                });
            });

            describe('Given that an opponent is trying to draw tax', function () {
                beforeEach(function () {
                    gameState.state.state.action = 'tax';
                    gameState.currentPlayer = AI_IDX;
                });

                it('should not include any blocking moves; only allow and challenge', function () {
                    var moves = player._test.getPossibleMoves(gameState);
                    expect(moves).to.eql([
                        {
                            command: 'allow'
                        },
                        {
                            command: 'challenge'
                        }
                    ]);
                });
            });
        });
    });
});